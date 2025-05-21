from django.urls import path
from .views import BlogListView, BlogDetailView, ReviewCreateView, CommentCreateView, BlogCreateView, register_view, logout_view, login_view
from . import views

app_name = 'blogapp'


urlpatterns = [
    path('', BlogListView.as_view(), name='blog_list'),
    path('blog/add/', BlogCreateView.as_view(), name='add_blog'),
    path('blog/<int:pk>/', BlogDetailView.as_view(), name='blog_detail'),
    path('blog/<int:pk>/review/', ReviewCreateView.as_view(), name='add_review'),
    path('blog/<int:blog_pk>/review/<int:review_pk>/comment/', CommentCreateView.as_view(), name='add_comment'),
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('buscar/', views.search_results, name='search_results'),
    path('perfil/', views.profile_view, name='perfil'),
    path('perfil/actualizar-imagen/', views.update_profile_image, name='update_profile_image'),
    path('perfil/<str:username>/', views.profile_view_user, name='perfil_user'),
    path('comment/<int:comment_id>/like/', views.like_comment, name='like_comment'),
    path('like-review/<int:review_id>/', views.like_review, name='like_review'),
]

    

