from django.conf import settings
from django.urls import path, include
from .views import searchAPI,filter_view,profileUpdateAPI,MovieListAPI,MovieDetailAPI,MovieUpdateAPI,MovieCreateAPI,CommentCreateAPI,rate_movie,user_profile,uploadImage,uploadTorrent
# , MovieAdd
# , Profileview

app_name = 'api'
urlpatterns = [
    path('movies', MovieListAPI.as_view(), name="home"),
    path('create', MovieCreateAPI.as_view(), name="create"),
    path('movies/<slug:slug>', MovieDetailAPI.as_view(), name="detail"),
    path('movies/<slug:slug>/update', MovieUpdateAPI, name="update"),
    path('movies/<int:pk>/comment', CommentCreateAPI, name="create-comment"),
    path('movies/<int:id>/rate',rate_movie, name="rate"),
    path('user',user_profile, name="user-profile"),
    path('user/createprofile',profileUpdateAPI, name="user-profile-create"),
    path('upload_mage',uploadImage, name="upload-image"),
    path('upload_torrent',uploadTorrent, name="upload-image"),
    path('browse',filter_view, name="filter_view"),
    path('search',searchAPI, name="filter"),

]
