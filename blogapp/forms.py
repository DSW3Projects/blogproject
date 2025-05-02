from django import forms # Importación de formularios de Django
from .models import Blog
from django_ckeditor_5.widgets import CKEditor5Widget # type: ignore # Widget de CKEditor 5 para aplicarlo en los formularios

class BlogForm(forms.ModelForm):
    class Meta:
        model = Blog
        fields = ['title', 'content']
        widgets = {'content': CKEditor5Widget(config_name='extends'),} # Se integra CKEditor 5 al campo 'content'