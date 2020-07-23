from django import forms
from .models import Movie,Comment


class movieform(forms.ModelForm):
    class Meta:
        model = Movie
        fields = ["category", "name", "year",
                  "torrent", "description", "image"]



class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = [ "name", "body"]
