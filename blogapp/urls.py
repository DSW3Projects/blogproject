from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from . import views
from .views import upload_image
app_name = 'blogapp'

urlpatterns = [
    # Blog
    path('blogs/', views.api_blog_list, name='blog_list'),
    path('blogs/create/', views.api_blog_create, name='add_blog'),
    path('blogs/<int:pk>/', views.api_blog_detail, name='blog_detail'),
    path('api/upload-image/', upload_image, name='upload_image'),
    path('blogs/<int:blog_id>/review/', views.api_create_review, name='add_review'),
    path('blogs/<int:blog_pk>/review/<int:review_pk>/comment/', views.api_create_comment, name='add_comment'),

    # Registro de usuario
    path('register/', views.register_view, name='register'),

    # JWT login/logout
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),

    # Dashboard admin
    path('admin-dashboard/', views.api_admin_dashboard, name='admin_dashboard'),

    # Buscador
    path('buscar/', views.api_blog_search, name='search_results'),

    # Perfil
    path('perfil/', views.api_profile_view, name='perfil'),
    path('perfil/actualizar-imagen/', views.api_update_profile_image, name='update_profile_image'),
    path('perfil/<str:username>/', views.api_profile_user, name='perfil_user'),

    # Likes
    path('comment/<int:comment_id>/like/', views.api_like_comment, name='like_comment'),
    path('like-review/<int:review_id>/', views.api_like_review, name='like_review'),
    path('tags/create/', views.api_tag_create, name='tag_create'),
    path('tags/', views.api_tag_list, name='tag_list'),
    path('upload-image/', views.upload_image, name='upload_image'),
]
