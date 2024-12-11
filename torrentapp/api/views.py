from rest_framework.generics import (CreateAPIView,ListAPIView,RetrieveAPIView,
RetrieveUpdateDestroyAPIView,
CreateAPIView,ListCreateAPIView,RetrieveUpdateAPIView)
from torrentapp.models import Movie,Comment,Rating,UserProfile
from .serializers import (MovieSerializer,MovieListSerializer,
CommentSerializer,RatingSerializer,UserProfileSerializer)
from rest_framework.pagination import PageNumberPagination
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from django.conf import settings
from django.contrib.auth import get_user_model
from ..filters import MovieFilter
class IsOwnerOrReadOnly(permissions.BasePermission):  
        def has_object_permission(self, request, view, obj):
            if request.method in permissions.SAFE_METHODS:
                return True

            return obj.user == request.user
class SetPagination(PageNumberPagination):
    page_size = 4
    page_size_query_param = 'page_size'
    max_page_size = 4

class MovieListAPI(ListAPIView):
    queryset=Movie.objects.all().order_by("-id")
    serializer_class=MovieListSerializer
    pagination_class = SetPagination
    permission_classes =(AllowAny,)

class MovieCreateAPI(CreateAPIView):
    queryset=Movie.objects.all().order_by("-id")
    serializer_class=MovieListSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MovieDetailAPI(RetrieveAPIView):
    queryset=Movie.objects.all().order_by("-id")
    serializer_class=MovieSerializer
    permission_classes =(AllowAny,)

    lookup_field="slug"



@api_view(["PUT"])
@permission_classes([IsAuthenticated,IsOwnerOrReadOnly])
def MovieUpdateAPI(request,slug):
    movie=get_object_or_404(Movie,slug=slug)
    movie.name=request.data["name"]
    movie.description=request.data["description"]
    movie.year=request.data["year"]
    movie.category=request.data["category"]
    movie.save()
    serializer=MovieSerializer(movie,many=False)
    return Response(serializer.data)




@api_view(["PUT"])
@permission_classes([IsAuthenticated,IsOwnerOrReadOnly])
def profileUpdateAPI(request):
    user_profile=request.user.userprofile
    user_profile.first=request.data["first"]
    user_profile.last=request.data["last"]
    user_profile.bio=request.data["bio"]

    user_profile.picture=request.data["picture"]
    user_profile.save()
    serializer=UserProfileSerializer(user_profile,many=False)
    return Response(serializer.data)




@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def CommentCreateAPI(request,pk):
    movie=get_object_or_404(Movie,id=pk)
    user=request.user
    body=request.data["body"]
    comment=Comment(movie=movie,user=user,body=body)
    comment.save()
    serializer=CommentSerializer(comment,many=False)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def rate_movie(request,id):
    movie=get_object_or_404(Movie,id=id)
    user=request.user
    stars=request.data["stars"]
    try:

        rating=Rating.objects.get(movie=movie,user=user)
        rating.stars=stars
        rating.save()

    except :

        rating=Rating(movie=movie,user=user,stars=stars)
        rating.save()

    serializer=RatingSerializer(rating,many=False)
    return Response(serializer.data)
 
@api_view(["GET"])
@permission_classes([IsAuthenticated,])
def user_profile(request):
    serializer=UserProfileSerializer(request.user.userprofile,many=False)
    return Response(serializer.data)

 
@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def uploadImage(request):
    data=request.data
    movie_id=data["movie_id"]
    movie=Movie.objects.get(id=movie_id)
    movie.image=request.FILES.get("image")
    movie.save()
    return Response(movie.image.url)


@api_view(["POST"])
@permission_classes([IsAuthenticated,])
def uploadTorrent(request):
    data=request.data
    movie_id=data["movie_id"]
    movie=Movie.objects.get(id=movie_id)
    movie.torrent=request.FILES.get("torrent")
    movie.save()
    return Response(movie.torrent.url)


@api_view(["GET"])
@permission_classes([AllowAny,])
def filter_view(request):
    print(request.GET)
    filter=MovieFilter(request.GET,queryset=Movie.objects.all())
    if filter.is_valid():
        serializer=MovieListSerializer(filter.qs,many=True)
    return Response(serializer.data)
    

 
@api_view(["GET"])
@permission_classes([AllowAny,])
def searchAPI(request):
    item_name = request.GET.get("q")
    if item_name != "" and item_name is not None:
        movies = Movie.objects.filter(name__icontains=item_name)
    else:
        movies=[]
    serializer=MovieListSerializer(movies,many=True)
    return Response(serializer.data)