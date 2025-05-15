from django import forms # Importación de formularios de Django
from .models import Blog, Tag
from django_ckeditor_5.widgets import CKEditor5Widget # type: ignore # Widget de CKEditor 5 para aplicarlo en los formularios


class BlogForm(forms.ModelForm):
    class Meta:
        model = Blog
        fields = ['title', 'content','tags' ]  # asegúrate de incluir 'tags'
        widgets = {'content': CKEditor5Widget(config_name='extends'),
            'tags': forms.SelectMultiple(attrs={
                'class': 'select-tags'
            }),
        }