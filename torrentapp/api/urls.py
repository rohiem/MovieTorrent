from django.conf import settings
from django.urls import path, include
from .views import MovieListAPI,MovieDetailAPI,MovieUpdateAPI,MovieCreateAPI,CommentCreateAPI
# , MovieAdd
# , Profileview

app_name = 'api'
urlpatterns = [
    path('movies', MovieListAPI.as_view(), name="home"),
    path('create', MovieCreateAPI.as_view(), name="create"),
    path('movies/<slug:slug>', MovieDetailAPI.as_view(), name="detail"),
    path('movies/<slug:slug>/update', MovieUpdateAPI.as_view(), name="update"),
    path('movies/<int:pk>/comment', CommentCreateAPI.as_view(), name="create-comment"),

]
