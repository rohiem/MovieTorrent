from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.db.models.signals import post_save,pre_save
from django.urls import reverse
from django.core.validators import MinValueValidator,MaxValueValidator
from django.db.utils import IntegrityError
import random
# Create your models here.

def unique_slug_generator(model_instane,name,year,slug ):

    slug=str(slugify(name)+"-"+slugify(year))
    
    model_class=model_instane.__class__
    while model_class.objects.filter(slug=slug).exists():

        object_pk=model_class.objects.filter(slug=slug).latest("pk")
        object_pk=object_pk.pk+1
        slug=str(slugify(name)+"-"+slugify(object_pk)+"-"+slugify(year))
    return slug

class UserProfile(models.Model):
    id = models.AutoField(primary_key=True)

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
    id = models.AutoField(primary_key=True)
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
    slug = models.SlugField(blank=True, null=True, unique=True )
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="movies",blank=True)

    def total_likes(self):
        return self.likes.count()

    def desc(self):
        return self.description[:50]


    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse("torrentapp:detail", kwargs={"slug": self.slug})
    def no_of_rating(self):
        rating=Rating.objects.filter(movie=self)
        return len(rating)
    def avg_of_rating(self):
        rating=Rating.objects.filter(movie=self)
        sum=0
        for rat in rating:
            sum+=rat.stars
        if sum>0:
            return sum/len(rating)
        else:
            return 0    
'''
    def save(self, *args, **kwargs):
        if not self.slug:
            slugname=slugify(self.name)
            slugyear=slugify(self.year)
            r2 = random.randint(1,10**10)
            self.slug = slugname+"-"+slugyear+"-"+str(r2)
        super(Movie, self).save(*args, **kwargs)
'''
class Comment(models.Model):
    id = models.AutoField(primary_key=True)

    movie = models.ForeignKey(
        Movie, related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, default=1)
    body = models.TextField(max_length=2000)
    date = models.DateTimeField(auto_now_add=True)
    is_spam=models.BooleanField(default=False)

    def __str__(self):
        return str(self.user.username)


class Rating(models.Model):
    id = models.AutoField(primary_key=True)

    movie = models.ForeignKey(Movie,  on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    stars=models.PositiveIntegerField(validators=[MinValueValidator(1),MaxValueValidator(5),])
    def __str__(self):
        return self.user.username +" rated "+self.movie.name+" "+str(self.stars)




    



def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)


post_save.connect(userprofile_receiver, sender=settings.AUTH_USER_MODEL)

def slug_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = unique_slug_generator(instance,instance.name,instance.year,instance.slug)


pre_save.connect(slug_receiver, sender=Movie)


