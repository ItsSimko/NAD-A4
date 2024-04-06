
from django.shortcuts import render
from .models import Post
from django.http import JsonResponse

# Create your views here.

def post_list_and_create(request):
    qs = Post.objects.all()
    return render(request, 'posts/main.html', {'qs': qs})

def load_posts_data_view(request, num_posts):
    visible = 3
    upper = num_posts
    lower = upper - visible

    size = Post.objects.all().count()

    qs = Post.objects.all()
    data = []
    counter = 0
    for obj in qs:
        item = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            'liked': True if request.user in obj.liked.all() else False,
            'like_count': obj.like_count,
            'author': obj.author.user.username
        }
        data.append(item)


    return JsonResponse({'data': data[lower:upper], 'size': size})