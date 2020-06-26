from django.conf import settings
from django.urls import path, include
from .views import UploadView
from django.conf.urls.static import static

app_name = 'upload'

urlpatterns = [
    path('', UploadView.as_view(), name='fileupload'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
