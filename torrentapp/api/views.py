from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveAPIView,RetrieveUpdateDestroyAPIView,CreateAPIView,ListCreateAPIView,RetrieveUpdateAPIView
from torrentapp.models import Movie,Comment,Rating,UserProfile
from .serializers import MovieSerializer,MovieListSerializer,CommentSerializer,RatingSerializer,UserProfileSerializer
from rest_framework.pagination import PageNumberPagination

from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from django.conf import settings
from django.contrib.auth import get_user_model
class IsOwnerOrReadOnly(permissions.BasePermission):  
        def has_object_permission(self, request, view, obj):
            if request.method in permissions.SAFE_METHODS:
                return True

            return obj.user == request.user
class SetPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 16

class MovieListAPI(ListAPIView):
    queryset=Movie.objects.all().order_by("-id")
    serializer_class=MovieListSerializer
    pagination_class = SetPagination

class MovieCreateAPI(CreateAPIView):
    queryset=Movie.objects.all().order_by("-id")
    serializer_class=MovieListSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MovieDetailAPI(RetrieveAPIView):
    queryset=Movie.objects.all().order_by("-id")
    serializer_class=MovieSerializer
    lookup_field="slug"


class MovieUpdateAPI(RetrieveUpdateDestroyAPIView,):
    queryset=Movie.objects.all().order_by("-id")
    serializer_class=MovieListSerializer
    permission_classes =(IsAuthenticated,IsOwnerOrReadOnly)

    lookup_field="slug"



class CommentCreateAPI(ListCreateAPIView):
    queryset=Comment.objects.all()
    serializer_class=CommentSerializer
    permission_classes =(IsAuthenticated,)
   
    def get_queryset(self):
        queryset=self.queryset.filter(movie_id=self.kwargs["pk"])
        return queryset

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
    except:
        rating=Rating(movie=movie,user=user,stars=stars)
        rating.save()
    serializer=RatingSerializer(rating,many=False)
    return Response(serializer.data)
 
@api_view(["GET"])
@permission_classes([IsAuthenticated,])
def user_profile(request):
    serializer=UserProfileSerializer(request.user.userprofile,many=False)
    return Response(serializer.data)

 