
from django.shortcuts import render
from .models import Post
from django.http import JsonResponse
from .forms import PostForm
from profiles.models import Profile

# Create your views here.

def post_list_and_create(request):
    form = PostForm(request.POST or None)
    #qs = Post.objects.all()

    if request.method == 'POST':
        if form.is_valid():
            author = Profile.objects.get(user=request.user)

            instance = form.save(commit=False)
            instance.author = author
            instance.save()
            form = PostForm()

    context = {
        'form': form,
        #'qs': qs,
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