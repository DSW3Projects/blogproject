from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django_ckeditor_5.fields import CKEditor5Field
from bs4 import BeautifulSoup # Importamos el CKEditor 5 para el texto enriquecido

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
        soup = BeautifulSoup(self.content, 'html.parser')
        img = soup.find('img')
        if img:
            return img['src']
        return None


class Review(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()  # Este es el campo que almacena el contenido HTML
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reviewer.username} - {self.blog.title}"



class Comment(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='comments')
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.commenter.username}"
    
