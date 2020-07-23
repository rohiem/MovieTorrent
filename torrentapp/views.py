from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView, View
from django.utils.decorators import method_decorator
from .models import Movie, UserProfile ,Comment
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from .forms import movieform,CommentForm
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy, reverse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.http import HttpResponseForbidden,HttpResponseRedirect
from .filters import MovieFilter
# Create your views here.
def LikeView(request,slug):
    movie=get_object_or_404(Movie,id=request.POST.get("movie_id"))
    liked=False
    if movie.likes.filter(id=request.user.id).exists():
        movie.likes.remove(request.user)
        liked=False
    else:
        movie.likes.add(request.user)
        liked=True
    return HttpResponseRedirect(reverse("torrentapp:detail",args=[str(slug)]))

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


'''
def handle_uploaded_file(f):
    filename, extension = os.path.splitext(torrent.name)
    relative_path = "torrent/%s" % filename
    full_path = "media/torrent" % relative_path
    with open(full_path, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    return relative_path
'''

'''
def createmovie(request):
    if request.method == "POST":
        form = movieform(request.POST, request.FILES, instance=request.user)
#        if request.FILES['myfile']:
#            entry.myfile.save(request.FILES['myfile']._name, request.FILES['myfile'], True)
        if form.is_valid():
            torrent = form.cleaned_data['torrent']
            form.save()
            return redirect('home')
        else:
            form = movieform()
    context = {
        "form": form
    }
    return render(request, "create.html", context)


def form_valid(self, form):

    if torrent:
        relative_path = handle_uploaded_file(torrent)
        form.instance.torrent = relative_path
        form.instance.save()
'''


def home(request):
    newmovie = Movie.objects.filter(new=True)[::-1][:4]
    mostmovie = Movie.objects.filter(mostwatch=True)[::-1][:4]
    highmovie = Movie.objects.filter(highrated=True)[::-1][:4]
    view = Movie.objects.all()[::-1][:8]
    item_name=request.GET.get("item")
    if item_name != "" and item_name is not None:
        view=  Movie.objects.filter(name__icontains=item_name) 
    context = {"newmovie": newmovie,
               "mostmovie": mostmovie,
               "highmovie": highmovie,
               "view": view,}
    return render(request, 'homeface.html', context)


def moviedetail(request, slug):
    moviedetail = get_object_or_404(Movie, slug=slug)
    total_likes=moviedetail.total_likes()
    liked=False
    if moviedetail.likes.filter(id=request.user.id).exists():
        liked=True

    context = {
        'moviedetail': moviedetail
        ,"total_likes":total_likes,
        "liked":liked
        }
    return render(request, 'moviedetail.html', context)


"""
@login_required(login_url='accounts/login')

def base(request,slug):
    user = Movie.user
    profile =get_object_or_404(UserProfile,slug=slug)
    context={"user":user,'profile':profile
    }
    return render(request,"home.html",context)
"""


@login_required(login_url='accounts/login')
def profile(request, slug):
    #    if not request.user. == UserProfile.slug:
    #        return HttpResponseForbidden()
    #    else:
    profile = get_object_or_404(UserProfile, slug=slug)

    if str(request.user) == str(profile.slug):
        profile = get_object_or_404(UserProfile, slug=slug)
    #    movie = Movie.objects.filter(slug=slug)[::-1]
    #    movie = Movie.objects.filter(Q(user=request.user) | Q(slug=slug))[::-1]
        movie = Movie.objects.filter(user=request.user)[::-1]
    #    movie = Movie.objects.get_or_create(user=TestModel2(id=1))4
    else:
        return HttpResponseForbidden()
    context = {
        'profile': profile,
        'movie': movie
    }
    return render(request, 'profile.html', context)


'''
search = request.GET['skills']
        #     skills contain search  OR  title contains search
query = Q(skills__icontains=search ) | Q(title__icontains=search )
job.objects.filter(query)
'''


class UploadView(LoginRequiredMixin, CreateView):
    model = Movie
    template_name = 'create.html'
#    fields = '__all__'
    fields = ["category", "name", "year",
              "torrent", "description", "image"]
    success_url = "/"

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super(UploadView, self).form_valid(form)
#    success_url = reverse('path.to.your.create.view')
#    success_url = reverse_lazy('torrentapp:detail')

#    def get_success_url(self):
#        return reverse_lazy('detail', kwargs={'slug': self.slug})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['documents'] = Movie.objects.all()
        return context


'''
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def form_valid(self, form):
        obj = form.save(commit=False)
        obj.user = self.request.user
        obj.save()
        return http.HttpResponseRedirect(self.success_url)
'''

'''
class Profileview(LoginRequiredMixin, CreateView):
    slug = ""
    model = UserProfile
    template_name = 'createprofile.html'
    fields = '__all__'
    success_url = "/"
#    success_url = reverse('path.to.your.create.view')
#    success_url = reverse_lazy('torrentapp:detail')

#    def get_success_url(self):
#        return reverse_lazy('detail', kwargs={'slug': self.slug})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['documents'] = UserProfile.objects.all()
        return context
'''

'''
def MovieAdd(request):
    form = movieform()
    if request.method == 'POST':
        form = movieform(request.POST)
        if form.is_valid():
            movie = form.save(commit=False)
            movie.user = request.user
            movie = movie.save()
            return redirect('/')
    else:
        form = movieform()
    context = {
        'form': form,
    }
    return render(request, 'add.html', context)
'''


class ProfileCreateView(LoginRequiredMixin, UpdateView):
    model = UserProfile
    template_name = 'createprofile.html'
#    fields = '__all__'
    fields = ["first", "last", "bio", "picture", "movies"]
    success_url = "/"

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super(ProfileCreateView, self).form_valid(form)
#    success_url = reverse('path.to.your.create.view')
#    success_url = reverse_lazy('torrentapp:detail')

#    def get_success_url(self):
#        return reverse_lazy('detail', kwargs={'slug': self.slug})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['documents'] = UserProfile.objects.all()
        return context

class AddCommentView(LoginRequiredMixin,CreateView):
    model= Comment
    form_class=CommentForm
    template_name="add_comment.html"
#    fields='__all__'
#    fields=("name","body")
    success_url = "/"
    def form_valid(self, form):
        form.instance.movie_id = self.kwargs["pk"]
        return super(AddCommentView, self).form_valid(form)
    