from django.conf import settings
from django.urls import path, include
from .views import( homeview, moviedetail, profile, home, UploadView, ProfileCreateView,
 browse,LikeView,AddCommentView,LikeApiView,LikeJsonView,CommentJsonView,searchJson,movie_search_filter_json)
# , MovieAdd
# , Profileview

app_name = 'torrentapp'
urlpatterns = [
    path('', home, name="homeface"),
    path('searchJson', searchJson, name="searchJson"),
    path('searchfilterjson', movie_search_filter_json, name="searchfilterjson"),
    path('movies', homeview.as_view(), name="home"),
    path('browse', browse.as_view(), name="browse"),
    path('movies/<int:pk>/addcomment', AddCommentView.as_view(), name="addcomment"),
    path('movies/<int:id>/commentjson', CommentJsonView, name="addcommentjson"),
    path('create', UploadView.as_view(), name="create"),
    path('profiles/<slug:slug>/createprofile', ProfileCreateView.as_view(), name="createprofile"),
    path('movies/<slug:slug>', moviedetail, name="detail"),
    path('profiles/<slug:slug>', profile, name="profile"),
    path('like/<slug:slug>',LikeView,name="like_movie"),
    path('likejson/',LikeJsonView,name="like_json_movie"),
    path('likeapi/<slug:slug>',LikeApiView.as_view(),name="like_api_movie"),
]
