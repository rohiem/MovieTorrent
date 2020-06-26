from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.db.models.signals import post_save

# Create your models here.

'''
class CurrentUserField(models.ForeignKey):
    def __init__(self, **kwargs):
        super(CurrentUserField, self).__init__(
            settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, **kwargs)

    def contribute_to_class(self, cls, name):
        super(CurrentUserField, self).contribute_to_class(cls, name)
        registry = registration.FieldRegistry()
        registry.add_field(cls, self)


class ClientDetails(models.Model):
    created_by = CurrentUserField()

'''


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=1)
    first = models.CharField(max_length=50)
    last = models.CharField(max_length=50)
    bio = models.TextField(max_length=1400, default="hello")
    picture = models.ImageField(blank=True, null=True, upload_to="profile")
    movies = models.ManyToManyField("Movie")
    slug = models.SlugField(blank=True, null=False)
#    moviess=models.ForeignKey("Movie",on_delete=models.DO_NOTHING,blank=True,null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.user.username)
        super(UserProfile, self).save(*args, **kwargs)

    def __str__(self):
        return self.user.username


class Cat(models.Model):
    name = models.CharField(max_length=50)
    desc = models.TextField(max_length=500)

    def __str__(self):
        return self.name


class Movie(models.Model):
    ACTION = 'AC'
    DRAMA = 'DR'
    SPORT = 'SP'
    ROMANCE = 'RO'
    ANIME = 'AN'
    COMEDY = "CO"
    BIOGRAPHY = "BI"
    HORROR = "HO"

    MOVIE_CHOICES = [
        (ACTION, 'Action'),
        (DRAMA, 'Drama'),
        (SPORT, 'Sport'),
        (ROMANCE, 'Romance'),
        (ANIME, 'Anime'),
        (BIOGRAPHY, 'Biography'),
        (COMEDY, 'Comedy'),
        (HORROR, 'Horror'),

    ]
    category = models.CharField(
        max_length=2,
        choices=MOVIE_CHOICES,
        default=ACTION,
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.DO_NOTHING, default=1)
    name = models.CharField(max_length=100)
    year = models.IntegerField()
    torrent = models.FileField(upload_to="torrent", max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(max_length=2000)
    image = models.ImageField(blank=True, null=True, upload_to="image")
    new = models.BooleanField(default=False)
    mostwatch = models.BooleanField(default=False)
    highrated = models.BooleanField(default=False)
    slug = models.SlugField(blank=True, null=True)
#    cat = models.ForeignKey(Cat, on_delete=models.CASCADE, default=None)

    def desc(self):
        return self.description[:50]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(Movie, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


#    def doc_name(self):
#        return self.torrent.name.split('/')[-1]


def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)


post_save.connect(userprofile_receiver, sender=settings.AUTH_USER_MODEL)
