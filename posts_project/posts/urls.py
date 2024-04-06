from django.urls import path
from .views import (
    post_list_and_create,
    load_posts_data_view
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-board'),
    path('getPosts', load_posts_data_view, name='posts-data')
]