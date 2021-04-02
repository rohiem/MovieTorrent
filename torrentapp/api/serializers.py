from rest_framework.serializers import ModelSerializer,SerializerMethodField,HyperlinkedIdentityField
from torrentapp.models import Movie,Comment
from rest_framework.fields import CurrentUserDefault, HiddenField

class MovieSerializer(ModelSerializer):
    user=SerializerMethodField()
    url_delete_update = HyperlinkedIdentityField(view_name='api:update',lookup_field="slug")
    class Meta:
        model=Movie
        fields=("url_delete_update","id",
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
    "likes")


    def get_user(self,obj):
        return obj.user.username

class MovieListSerializer(ModelSerializer):
    detail_url = HyperlinkedIdentityField(view_name='api:detail',lookup_field="slug")
    user=SerializerMethodField()

    class Meta:
        model=Movie
         
        fields=("name",
        "category",
            "year",
            "torrent",
            "description",
            "image",
            "new",
            "mostwatch",
            "highrated",
            "user",
            "detail_url",)
    def get_user(self,obj):
        return obj.user.username


class CommentSerializer(ModelSerializer):
    user=SerializerMethodField()

    class Meta:
        model=Comment
        fields='__all__'
    
    def get_user(self,obj):
        return obj.user.username
