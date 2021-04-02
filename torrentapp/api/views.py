from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveAPIView,RetrieveUpdateDestroyAPIView,CreateAPIView,ListCreateAPIView
from torrentapp.models import Movie,Comment
from .serializers import MovieSerializer,MovieListSerializer,CommentSerializer
from rest_framework.pagination import PageNumberPagination

from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated


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

class MovieUpdateAPI(RetrieveUpdateDestroyAPIView):
    queryset=Movie.objects.all().order_by("-id")
    serializer_class=MovieListSerializer
    lookup_field="slug"


class CommentCreateAPI(ListCreateAPIView):
    queryset=Comment.objects.all()
    serializer_class=CommentSerializer
    permission_classes =(IsAuthenticated,)
   
    def get_queryset(self):
        queryset=self.queryset.filter(movie_id=self.kwargs["pk"])
        return queryset
