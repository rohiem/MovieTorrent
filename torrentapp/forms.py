from django import forms
from .models import Movie


class movieform(forms.ModelForm):
    class Meta:
        model = Movie
        fields = ["category", "name", "year",
                  "torrent", "description", "image"]
