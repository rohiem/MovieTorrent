from rest_framework.serializers import ModelSerializer,SerializerMethodField,HyperlinkedIdentityField,ImageField
from torrentapp.models import Movie,Comment,Rating,UserProfile
from rest_framework.fields import CurrentUserDefault, HiddenField
from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import serializers    



class CommentSerializer(ModelSerializer):
    user=SerializerMethodField()

    class Meta:
        model=Comment
        fields='__all__'
    
    def get_user(self,obj):
        return obj.user.username

class MovieSerializer(ModelSerializer):
    user=SerializerMethodField()
 #   url_delete_update = HyperlinkedIdentityField(view_name='api:update',lookup_field="slug")
    image = ImageField(max_length=None, use_url=True, required=True)
    comments=SerializerMethodField()
    likes=SerializerMethodField()
    likes_count=SerializerMethodField()
    class Meta:
        model=Movie
        fields=(#"url_delete_update",
        "id",
    "category",
    "name",
    "year",
    "torrent",
    "date",
    "description",
    "image",
    "new",
    "mostwatch",
    "highrated",
    "slug",
    "user",
    "likes",
    "comments",
    "likes_count","no_of_rating","avg_of_rating")

    def get_likes_count(self,obj):
        return obj.total_likes()
    def get_no_of_rating(self,obj):
        return obj.no_of_rating()
    def get_avg_of_rating(self,obj):
        return obj.avg_of_rating()
    def get_user(self,obj):
        return obj.user.username
    def get_likes(self,obj):
        li=[]
        for i in obj.likes.all():
            li.append(i.username)
        return li

    def get_comments(self,obj):
        comments= obj.comments.all()  
        serializer=CommentSerializer(comments,many=True)
        return serializer.data  

class MovieListSerializer(ModelSerializer):
   # detail_url = HyperlinkedIdentityField(view_name='api:detail',lookup_field="slug")
    user=SerializerMethodField()
    image = ImageField(max_length=None, use_url=True, required=True)

    class Meta:
        model=Movie
         
        fields=("id",
            "name",
            "category",
            "year",
            "torrent",
            "description",
            "image",
            "new",
            "mostwatch",
            "highrated",
            "user",
            "slug"
          #  "detail_url",
          )
    def get_user(self,obj):
        return obj.user.username


class CommentSerializer(ModelSerializer):
    user=SerializerMethodField()
    image=SerializerMethodField()

    class Meta:
        model=Comment
        fields='__all__'
    
    def get_user(self,obj):
        return obj.user.username
    def get_image(self,obj):
        return obj.user.userprofile.picture.url


class RatingSerializer(ModelSerializer):
    user=SerializerMethodField()

    class Meta:
        model=Rating
        fields='__all__'
    
    def get_user(self,obj):
        return obj.user.username





class UserProfileSerializer(ModelSerializer):

    movies=MovieListSerializer(many=True)
    movieCreated=SerializerMethodField()
    class Meta:
        model=UserProfile
        fields=("id",
            "first",
            "last",
            "bio",
            "picture",
            "movies",
            "slug","movieCreated")
    def get_movieCreated(self,obj):
        movie =obj.user.movie_set.all()[::-1]
        serializer=MovieSerializer(movie,many=True)
        return serializer.data


    

