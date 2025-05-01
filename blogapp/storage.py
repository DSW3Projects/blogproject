from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os

class CKEditorCustomStorage(FileSystemStorage):
    def __init__(self, *args, **kwargs):
        kwargs['location'] = os.path.join(settings.MEDIA_ROOT, 'uploads')
        kwargs['base_url'] = settings.MEDIA_URL + 'uploads/'
        super().__init__(*args, **kwargs)
