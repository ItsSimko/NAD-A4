from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    # if not using crispy define fields
    #title = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Title'}))
    #body = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Write your post...', 'rows': '3'}))
    class Meta:
        model = Post
        fields = [
            'title',
            'body'
        ]