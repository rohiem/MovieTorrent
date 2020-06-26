from django.shortcuts import render
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy
from .models import mytorrent


class UploadView(CreateView):
    model = mytorrent
#    template_name = 'create.html'
    fields = ['torrent']
    success_url = reverse_lazy('files/')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['documents'] = mytorrent.objects.all()
        return context
