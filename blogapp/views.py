
from django.views.generic import ListView, DetailView, CreateView
from django.urls import reverse_lazy
from .models import Blog, Review, Comment
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import logout, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import user_passes_test
from .forms import BlogForm  # Importa tu formulario aquí
from django.utils.timezone import localtime
from collections import defaultdict
from django.db.models import Count
import json
from django.db.models import Avg



@user_passes_test(lambda u: u.is_authenticated and u.is_superuser)
def admin_dashboard(request):
    total_blogs = Blog.objects.count()
    total_users = User.objects.count()
    total_reviews = Review.objects.count()

    # Blog con más reviews
    blog_mas_reviews = Blog.objects.annotate(num_reviews=Count('reviews')).order_by('-num_reviews').first()

    # Usuario con más reviews
    usuario_mas_reviews = User.objects.annotate(num_reviews=Count('review')).order_by('-num_reviews').first()

    # Conteo de blogs por día
    blogs_por_dia = Blog.objects.all().order_by('created_at')
    blog_count_by_date = defaultdict(int)

    for blog in blogs_por_dia:
        fecha = localtime(blog.created_at).date()
        blog_count_by_date[str(fecha)] += 1

    fechas = list(blog_count_by_date.keys())
    cantidades = list(blog_count_by_date.values())

    context = {
        'total_blogs': total_blogs,
        'total_users': total_users,
        'total_reviews': total_reviews,
        'blog_mas_reviews': blog_mas_reviews,
        'usuario_mas_reviews': usuario_mas_reviews,
        'fechas': fechas,
        'cantidades': cantidades,
        'fechas': json.dumps(fechas),
        'cantidades': json.dumps(cantidades),
    }

    return render(request, 'blogapp/admin_dashboard.html', context)


# views.py

# views.py

from .models import Blog, Tag

def search_results(request):
    query = request.GET.get('q')
    blogs = Blog.objects.filter(tags__name__icontains=query).distinct() if query else []
    return render(request, 'blogapp/blog_list.html', {'object_list': blogs})


class BlogListView(ListView):
    model = Blog
    template_name = 'blogapp/blog_list.html'
    context_object_name = 'object_list'

    def get_queryset(self):
        return Blog.objects.annotate(
            average_rating=Avg('reviews__rating')
        ).prefetch_related('tags', 'author')


class BlogDetailView(DetailView):
    model = Blog
    template_name = 'blogapp/blog_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        blog = self.object
        user = self.request.user

        # Solo si el usuario está autenticado
        if user.is_authenticated:
            context['has_reviewed'] = Review.objects.filter(blog=blog, reviewer=user).exists()
        else:
            context['has_reviewed'] = False

        return context


class BlogCreateView(LoginRequiredMixin, CreateView):
    model = Blog
    form_class = BlogForm  # Usa tu formulario en lugar de 'fields'
    template_name = 'blog_form.html'

    def form_valid(self, form):
        form.instance.author = self.request.user  # Asocia el usuario actual como autor
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.object.pk})


from django.contrib import messages
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView

from .models import Review

class ReviewCreateView(CreateView):
    model = Review
    fields = ['rating', 'comment']
    template_name = 'blogapp/review_form.html'

    def form_valid(self, form):
        blog_id = self.kwargs['pk']
        user = self.request.user

        # Verifica si ya existe una review del usuario para este blog
        if Review.objects.filter(blog_id=blog_id, reviewer=user).exists():
            messages.error(self.request, "You have already submitted a review for this blog.")
            return redirect('blogapp:blog_detail', pk=blog_id)

        form.instance.reviewer = user
        form.instance.blog_id = blog_id
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.kwargs['pk']})



class CommentCreateView(CreateView):
    model = Comment
    fields = ['content']
    template_name = 'blogapp/comment_form.html'

    def form_valid(self, form):
        form.instance.commenter = self.request.user
        form.instance.review_id = self.kwargs['review_pk']
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('blogapp:blog_detail', kwargs={'pk': self.kwargs['blog_pk']})
    
@login_required
def logout_view(request):
    logout(request)
    return redirect('blogapp:blog_list')

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('blogapp:blog_list')  # Asegúrate de tener esta vista
        else:
            messages.error(request, 'Usuario o contraseña incorrectos.')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})



def register_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        if password1 != password2:
            # Si las contraseñas no coinciden
            return render(request, 'register.html', {'error': 'Las contraseñas no coinciden'})

        if not username or not email or not password1:
            # Si falta algún campo
            return render(request, 'register.html', {'error': 'Por favor, completa todos los campos'})

        try:
            user = User.objects.create_user(username=username, email=email, password=password1)
            user.save()
            login(request, user) 
            return redirect('blogapp:blog_list') 
        except Exception as e:
           
            return render(request, 'blogapp:bloglist.html', {'error': 'Hubo un error al crear la cuenta. Inténtalo de nuevo.'})

    return render(request, 'register.html')

# views.py

from .models import UserProfile

@login_required
def update_profile_image(request):
    if request.method == 'POST' and request.FILES.get('profile_image'):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        profile.profile_image = request.FILES['profile_image']
        profile.save()
    return redirect('blogapp:perfil')

def profile_view_user(request, username):
    user = get_object_or_404(User, username=username)
    return render(request, 'blogapp/profile_user.html', {'profile_user': user})

@login_required
def profile_view(request):
    return render(request, 'perfil.html')

@login_required
def like_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    if request.user in comment.likes.all():
        comment.likes.remove(request.user)
    else:
        comment.likes.add(request.user)
    return redirect(request.META.get('HTTP_REFERER', '/'))

@login_required
def like_review(request, review_id):
    review = get_object_or_404(Review, id=review_id)
    if request.user in review.likes.all():
        review.likes.remove(request.user)
    else:
        review.likes.add(request.user)
    return redirect(request.META.get('HTTP_REFERER', '/'))