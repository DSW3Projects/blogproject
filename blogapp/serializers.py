from rest_framework import serializers
from .models import Blog, Review, Comment, Tag, UserProfile
from django.contrib.auth.models import User
from .models import UploadedImage
from rest_framework import serializers


class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True, label="Confirmar contraseña")

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# Mostrar datos del usuario
class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

    def get_profile(self, obj):
        try:
            profile = obj.userprofile
        except UserProfile.DoesNotExist:
            return None
        serializer = UserProfileSerializer(profile, context=self.context)
        return serializer.data


# Imagen de perfil (ruta absoluta)
class UserProfileSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['profile_image_url']

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image:
            url = obj.profile_image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class BlogSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    first_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = '__all__'

    def get_first_image_url(self, obj):
        request = self.context.get("request")
        url = obj.first_image_url  # Usa la propiedad del modelo
        if url:
            if url.startswith('http'):
                return url
            else:
                # Construye url absoluta si es relativa
                return request.build_absolute_uri(url)
        return None


# Reviews
class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'

# Comentarios
class CommentSerializer(serializers.ModelSerializer):
    commenter = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

class UploadedImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = UploadedImage
        fields = ['id', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            url = obj.image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None