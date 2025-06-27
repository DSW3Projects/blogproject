from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django_ckeditor_5.fields import CKEditor5Field
from bs4 import BeautifulSoup 
import re


# MODELOS
class Tag(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name
    


class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = CKEditor5Field('Content', config_name='extends')  # CKEditor para el contenido
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag, related_name='blogs')

    def __str__(self):
        return self.title

    @property
    def first_image_url(self):
        # Primero intenta obtener de HTML
        soup = BeautifulSoup(self.content, 'html.parser')
        img = soup.find('img')
        if img:
            return img['src']
        
        # Si no encuentra img en HTML, intenta extraer URL de Markdown
        md_img_regex = r'!\[.*?\]\((.*?)\)'
        match = re.search(md_img_regex, self.content)
        if match:
            return match.group(1)
        
        return None


class Review(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='liked_reviews', blank=True)

    def total_likes(self):
        return self.likes.count()



class Comment(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='comments')
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='liked_comments', blank=True)

    def total_likes(self):
        return self.likes.count()
    
def user_profile_image_path(instance, filename):
    return f'user/{instance.user.username}/profile_images/{filename}'

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(
        upload_to=user_profile_image_path, 
        blank=True,
        null=True
    )

    def __str__(self):
        return self.user.username

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploads/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.image.name