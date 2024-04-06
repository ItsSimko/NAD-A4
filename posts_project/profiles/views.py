from django.shortcuts import render
from .models import Profile
from .forms import ProfileForm
from django.http import JsonResponse

# Create your views here.
def my_profile_view(request):
    profile = Profile.objects.get(user=request.user)
    form = ProfileForm(request.POST or None, request.FILES or None, instance=profile)

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if form.is_valid():
            instance = form.save()
            return JsonResponse({
                'bio': instance.bio,
                'avatar': instance.avatar.url,
                'user': instance.user.username,
            })
        
    context = {
        'obj': profile,
        'form': form,
    }

    return render(request, 'profiles/main.html', context)