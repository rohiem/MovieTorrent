from django.conf import settings
from django.urls import path, include
from .views import homeview, moviedetail, profile, home, UploadView, ProfileCreateView, browse
# , MovieAdd
# , Profileview

app_name = 'torrentapp'
urlpatterns = [
    path('', home, name="homeface"),
    path('movies', homeview.as_view(), name="home"),
    path('browse', browse.as_view(), name="browse"),
    #    path('add', MovieAdd, name="add"),
    path('create', UploadView.as_view(), name="create"),
    path('profiles/<slug:slug>/createprofile',
         ProfileCreateView.as_view(), name="createprofile"),
    path('movies/<slug:slug>', moviedetail, name="detail"),
    path('profiles/<slug:slug>', profile, name="profile")
]
