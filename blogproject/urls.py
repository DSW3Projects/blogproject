from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Incluimos las URLs para CKEditor
    path("ckeditor5/", include('django_ckeditor_5.urls')),

    # Rutas para cambio de contraseña
    path('password-change/', auth_views.PasswordChangeView.as_view(template_name='registration/password_change_form.html'), name='password_change'),
    path('password-change/done/', auth_views.PasswordChangeDoneView.as_view(template_name='registration/password_change_done.html'), name='password_change_done'),

    # JWT Token routes (si las necesitas también fuera del namespace api/)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Incluimos solo UNA vez las URLs del blogapp, con namespace, bajo api/
    path('api/', include(('blogapp.urls', 'blogapp'), namespace='blogapp')),
    path('api/', include('blogapp.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
