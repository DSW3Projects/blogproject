from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Count, Avg
from collections import defaultdict
from django.contrib.auth.models import User
from django.utils.timezone import localtime
from .models import UploadedImage
from .serializers import TagSerializer, UploadedImageSerializer
from .models import Blog, Review, Comment, Tag, UserProfile
from .serializers import TagSerializer
from .serializers import (
    BlogSerializer,
    ReviewSerializer,
    CommentSerializer,
    UserSerializer,
    UserProfileSerializer,
    UserRegisterSerializer
)

# Registro de usuario
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Usuario creado exitosamente'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_admin_dashboard(request):
    if not request.user.is_superuser:
        return Response({'error': 'No autorizado'}, status=403)

    total_blogs = Blog.objects.count()
    total_users = User.objects.count()
    total_reviews = Review.objects.count()

    blog_mas_reviews = Blog.objects.annotate(num_reviews=Count('reviews')).order_by('-num_reviews').first()
    usuario_mas_reviews = User.objects.annotate(num_reviews=Count('review')).order_by('-num_reviews').first()

    blog_count_by_date = defaultdict(int)
    for blog in Blog.objects.all().order_by('created_at'):
        fecha = localtime(blog.created_at).date().isoformat()
        blog_count_by_date[fecha] += 1

    return Response({
        'total_blogs': total_blogs,
        'total_users': total_users,
        'total_reviews': total_reviews,
        'blog_mas_reviews': BlogSerializer(blog_mas_reviews, context={"request": request}).data if blog_mas_reviews else None,
        'usuario_mas_reviews': UserSerializer(usuario_mas_reviews, context={"request": request}).data if usuario_mas_reviews else None,
        'fechas': list(blog_count_by_date.keys()),
        'cantidades': list(blog_count_by_date.values())
    })


@api_view(['GET'])
def api_blog_list(request):
    blogs = Blog.objects.annotate(average_rating=Avg('reviews__rating')).prefetch_related('tags', 'author')
    serializer = BlogSerializer(blogs, many=True, context={'request': request})
    return Response(serializer.data)



@api_view(['GET'])
def api_blog_detail(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    serializer = BlogSerializer(blog, context={"request": request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_blog_create(request):
    serializer = BlogSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def api_blog_search(request):
    query = request.GET.get('q')
    blogs = Blog.objects.filter(tags__name__icontains=query).distinct() if query else Blog.objects.none()
    serializer = BlogSerializer(blogs, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_create_review(request, blog_id):
    blog = get_object_or_404(Blog, id=blog_id)
    if Review.objects.filter(blog=blog, reviewer=request.user).exists():
        return Response({'error': 'Ya has reseñado este blog'}, status=400)
    serializer = ReviewSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save(blog=blog, reviewer=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_create_comment(request, review_id):
    review = get_object_or_404(Review, id=review_id)
    serializer = CommentSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save(review=review, commenter=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_like_review(request, review_id):
    review = get_object_or_404(Review, id=review_id)
    if request.user in review.likes.all():
        review.likes.remove(request.user)
    else:
        review.likes.add(request.user)
    return Response({'likes': review.likes.count()})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_like_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    if request.user in comment.likes.all():
        comment.likes.remove(request.user)
    else:
        comment.likes.add(request.user)
    return Response({'likes': comment.likes.count()})


@api_view(['GET'])
def api_profile_user(request, username):
    user = get_object_or_404(User, username=username)
    serializer = UserSerializer(user, context={"request": request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_profile_view(request):
    serializer = UserSerializer(request.user, context={"request": request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_update_profile_image(request):
    if request.FILES.get('profile_image'):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.profile_image = request.FILES['profile_image']
        profile.save()
        return Response({'status': 'ok'})
    return Response({'error': 'No image provided'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No se recibió imagen'}, status=400)
    image_file = request.FILES['image']
    uploaded_image = UploadedImage.objects.create(image=image_file, uploaded_by=request.user)
    return Response({'url': uploaded_image.image.url})

@permission_classes([AllowAny])
def api_tag_list(request):
    tags = Tag.objects.all()
    serializer = TagSerializer(tags, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_tag_create(request):
    serializer = TagSerializer(data=request.data)
    if serializer.is_valid():
        tag = serializer.save()
        return Response(TagSerializer(tag).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def api_tag_list(request):
    tags = Tag.objects.all()
    serializer = TagSerializer(tags, many=True)
    return Response(serializer.data)