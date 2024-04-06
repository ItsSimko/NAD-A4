from .models import Post
from profiles.models import Profile
from django.http import HttpResponse

def action_permission(func):
    def wrapper(request, **kwargs):
        pk = kwargs.get('pk')
        profile = Profile.objects.get(user=request.user)
        post = Post.objects.get(pk=pk)
        if profile == post.author:
            return func(request, **kwargs)
        else:
            return HttpResponse('You are not allowed to do this action')
        
    return wrapper