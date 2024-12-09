from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView, View
from django.utils.decorators import method_decorator
from .models import Movie, UserProfile, Comment,Rating
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from .forms import movieform, CommentForm
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy, reverse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.http import HttpResponseForbidden, HttpResponseRedirect
from .filters import MovieFilter
# Create your views here.
from rest_framework import generics,views,permissions,authentication
from rest_framework.response import Response
from django.http import HttpResponse,JsonResponse
from django.core import serializers
import json
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from allauth.account.views import SignupView as AllAuthSignupView
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from torrent.tasks import spam_filterAPI#spam_filter,

'''
class MySignupView(AllAuthSignupView):
    def get_success_url(self):
        return reverse("torrentapp:createprofile" ,kwargs={"slug":str(self.request.user.username)})
'''




def LikeView(request, slug):
    movie = get_object_or_404(Movie, id=request.POST.get("movie_id"))
    liked = False
    if movie.likes.filter(id=request.user.id).exists():
        movie.likes.remove(request.user)
        liked = False
    else:
        movie.likes.add(request.user)
        liked = True
    return HttpResponseRedirect(reverse("torrentapp:detail", args=[str(slug)]))

@login_required(login_url='accounts/login')
@require_POST
def LikeJsonView(request):
    if request.method == 'POST':

        movie = get_object_or_404(Movie, id=request.POST.get("id"))
        liked = False
        if movie.likes.filter(id=request.user.id).exists():
            movie.likes.remove(request.user)
            liked = False
        else:
            movie.likes.add(request.user)
            liked = True
    
    data={"liked":liked,"totalLikes":movie.total_likes()}
    return HttpResponse(json.dumps(data), content_type='application/json')

class LikeApiView(views.APIView):
    permission_classses=(permissions.IsAuthenticated,)
    authentication_classes=(authentication.SessionAuthentication,)

    def get(self,request,slug,*args, **kwargs):
        movie = get_object_or_404(Movie, slug=slug)
        liked = False
        if movie.likes.filter(id=request.user.id).exists():
            movie.likes.remove(request.user)
            liked = False
        else:
            movie.likes.add(request.user)
            liked = True
        data={"liked":liked,"totalLikes":movie.total_likes()}
        return Response(data)

class homeview(ListView):
    model = Movie
    paginate_by = 8
#    context_object_name=
    template_name = 'home.html'

    def get_queryset(self, *args, **kwargs):
        qs = super(homeview, self).get_queryset(*args, **kwargs)
        qs = qs.order_by("-id")
        return qs


class browse(ListView):
    model = Movie
    paginate_by=8
    template_name = 'browse.html'


    def get_queryset(self, *args, **kwargs):
        qs = super(browse, self).get_queryset(*args, **kwargs)
        qs = qs.order_by("-id")
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['filter'] = MovieFilter(
            self.request.GET, queryset=self.get_queryset())
        return context

# adding redis 
#
#

""" 
    queryset = cache.get('my_model_queryset')

    if not queryset:
        # If not in the cache, fetch from the database
        queryset = MyModel.objects.filter(active=True)
        # Store the result in the cache for future use
        cache.set('my_model_queryset', queryset, timeout=300)  # Timeout is optional
 """
 
#@cache_page(60 * 5)  # Cache for 5 minutes
def home(request):
    newmovie = Movie.objects.filter(new=True)[::-1][:4]
    mostmovie = Movie.objects.filter(mostwatch=True)[::-1][:4]
    highmovie = Movie.objects.filter(highrated=True)[::-1][:4]
    view = Movie.objects.all()[::-1][:8]
    item_name = request.GET.get("q")
    if item_name != "" and item_name is not None:
        view = Movie.objects.filter(name__icontains=item_name)
    context = {"newmovie": newmovie,
               "mostmovie": mostmovie,
               "highmovie": highmovie,
               "view": view, }
    return render(request, 'homeface.html', context)



data=[]
def searchJson(request):
    global data
    item_name = request.GET.get("q")
    if item_name != "" and item_name is not None:
        movies = Movie.objects.filter(name__icontains=item_name)

        data=[{"image": x.image.url, "name": x.name,"year":x.year,"url":x.get_absolute_url()} for x in movies]

    return JsonResponse(data ,safe=False)




# adding redis to cash page
#
#
#@cache_page(60 * 5)  # Cache for 5 minutes
#
#
# 
def moviedetail(request, slug):
    moviedetail = get_object_or_404(Movie, slug=slug)
    total_likes = moviedetail.total_likes()
    liked = False
    try:
        if moviedetail.likes.filter(id=request.user.id).exists():
            liked = True
    except:
        pass
    
    context = {
        'moviedetail': moviedetail,
         "total_likes": total_likes,
        "liked": liked,
        "form":CommentForm(request.POST or None)
    }
    try:   
        rating=Rating.objects.get(movie=moviedetail,user=request.user.id)
        context.update({ 'rating':rating})
    except Rating.DoesNotExist:
        pass

    return render(request, 'moviedetail.html', context)

@login_required(login_url='accounts/login')
def profile(request, slug):
    profile = get_object_or_404(UserProfile, slug=slug)
  #  favourite=Movie.objects.filter(likes=request.user)

#
# adding redis to cash queryset
#


    favourite = cache.get('my_model_queryset')
    print("cash:",favourite)
    if not favourite:
        favourite=Movie.objects.filter(likes=request.user)
        print("db")
        cache.set('my_model_queryset', favourite, timeout=300) 


#
#
#



    if str(request.user) == str(profile.slug):
        profile = get_object_or_404(UserProfile, slug=slug)
        movie = Movie.objects.filter(user=request.user)[::-1]
    else:
        return HttpResponseForbidden()

    context = {
        'profile': profile,
        'movie': movie,
        "favourite":favourite,

    }
    return render(request, 'profile.html', context)




class UploadView(LoginRequiredMixin, CreateView):
    model = Movie
    template_name = 'create.html'
    fields = ["category", "name", "year",
              "torrent", "description", "image"]

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super(UploadView, self).form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['documents'] = Movie.objects.all()
        return context




class ProfileCreateView(LoginRequiredMixin, UpdateView):
    model = UserProfile
    template_name = 'createprofile.html'
    fields = ["first", "last", "bio", "picture", ]
    success_url = "/"

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super(ProfileCreateView, self).form_valid(form)
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['documents'] = UserProfile.objects.all()
        return context


class AddCommentView(LoginRequiredMixin, CreateView):
    model = Comment
    form_class = CommentForm
    template_name = "add_comment.html"

    def form_valid(self, form):
        form.instance.movie_id = self.kwargs["pk"]
        form.instance.user = self.request.user
        return super(AddCommentView, self).form_valid(form)



    def get_success_url(self):
        movie=Movie.objects.get(id=self.kwargs["pk"])
        return reverse_lazy('torrentapp:detail', kwargs={'slug': movie.slug})
#
#
#
#ADDING CELERY TASK TO FILTER SPAM BY LIBRARY TO FILTER SPAMS
#
#
#


""" 

@login_required(login_url='accounts/login')
@require_POST
def CommentJsonView(request,id):
    if request.method == 'POST':
        #catch the ip address
        remote_addr = request.META.get('REMOTE_ADDR')

        movie = get_object_or_404(Movie, id=id)
        comment=CommentForm(request.POST or None)
        if comment.is_valid():
            comment=Comment(movie=movie,user=request.user,body=request.POST["body"])
            comment.save()
            # Check spam asynchronously.
        #task=spam_filter.delay(comment.id)
        taskAPI=spam_filterAPI.delay(comment.id)
    import time
    time.sleep(2)   

    cashed_comment = cache.get('comment')
    print("cash:",cashed_comment)
    if not cashed_comment:
        cashed_comment=comment.body
        cache.set('comment', cashed_comment, timeout=2) 



    data={"body":comment.body,"user":comment.user.username,"date":comment.date,"image":comment.user.userprofile.picture.url}
    return JsonResponse(data)
 """





 

@login_required(login_url='accounts/login')
@require_POST
def CommentJsonView(request,id):
    if request.method == 'POST':
        #catch the ip address
        remote_addr = request.META.get('REMOTE_ADDR')

        movie = get_object_or_404(Movie, id=id)
        comment=CommentForm(request.POST or None)
        if comment.is_valid():
            comment=Comment(movie=movie,user=request.user,body=request.POST["body"])
            comment.save()
            # Check spam asynchronously.
        taskAPI=spam_filterAPI.delay(comment.id)
    data={"body":comment.body,"user":comment.user.username,"date":comment.date,"image":comment.user.userprofile.picture.url}
    return JsonResponse(data)



def movie_search_filter_json(request):
    f = MovieFilter(request.GET, queryset=Movie.objects.all())
    data=[{"image": x.image.url, "name": x.name,"year":x.year,"url":x.get_absolute_url() ,"desc":x.desc()}for x in f.qs]
    return JsonResponse(data[::-1],safe=False)








@login_required
@require_POST
def rate_movie(request,id):
    movie=get_object_or_404(Movie,id=id)
    user=request.user
    stars=request.POST["stars"]
    try:
        rating=Rating.objects.get(movie=movie,user=user)
        rating.stars=stars
        rating.save()
    except:
        rating=Rating(movie=movie,user=user,stars=stars)
        rating.save()
    data={"stars":rating.stars,"nom":movie.no_of_rating(),"avg":round(float(movie.avg_of_rating()),1)}
    return JsonResponse(data)
 