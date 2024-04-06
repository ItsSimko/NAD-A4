
from django.shortcuts import render
from .models import Post, Photo
from django.http import JsonResponse
from .forms import PostForm
from profiles.models import Profile
from django.http import HttpResponse
from .utils import action_permission
from django.contrib.auth.decorators import login_required


# Create your views here.
@login_required
def post_list_and_create(request):
    form = PostForm(request.POST or None)

    if form.is_valid():
        author = Profile.objects.get(user=request.user)

        instance = form.save(commit=False)
        instance.author = author
        instance.save()
        form = PostForm()
        return JsonResponse({
            'title': instance.title,
            'body': instance.body,
            'author': instance.author.user.username,
            'created': instance.created,
            'id': instance.id,
        })

    context = {
        'form': form,
    }

    return render(request, 'posts/main.html', context)

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

def like_unlike_post(request):
    if request.method == 'POST':
        pk = request.POST.get('pk')
        post_obj = Post.objects.get(pk=pk)

        if request.user in post_obj.liked.all():
            liked=False
            post_obj.liked.remove(request.user)
        else:
            liked=True
            post_obj.liked.add(request.user)

    return JsonResponse({'liked': liked, 'count': post_obj.like_count})

def post_detail_data_view(request, pk):
    obj = Post.objects.get(pk=pk)
    data = {
        'id': obj.id,
        'title': obj.title,
        'body': obj.body,
        'author': obj.author.user.username,
        'logged_in': request.user.username
    }

    return JsonResponse({'data': data})

def post_detail(request, pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()


    return render(request, 'posts/detail.html', {'obj': obj, 'form': form})

@action_permission
def update_post(request, pk):
    obj = Post.objects.get(pk=pk)

    new_title = request.POST.get('title')
    new_body = request.POST.get('body')
    obj.title = new_title
    obj.body = new_body
    obj.save()

    return JsonResponse({
        'title': obj.title,
        'body': obj.body,
    })

@action_permission
def delete_post(request, pk):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        obj = Post.objects.get(pk=pk)
        obj.delete()
        return JsonResponse({})  
    
    return JsonResponse({'msg': 'Denied.'})

def image_upload_view(request):
    if request.method == 'POST':
        img = request.FILES.get('file')
        new_post_id = request.POST.get('new_post_id')
        post = Post.objects.get(id=new_post_id)
        Photo.objects.create(post=post, image=img)
    return HttpResponse()
