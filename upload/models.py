from django.db import models
from django.urls import reverse

# Create your models here.


class mytorrent(models.Model):
    torrent = models.FileField(upload_to="upload", max_length=100)

    def get_absolute_url(self):  # new
        return reverse('fileupload', args=[str(self.id)])
