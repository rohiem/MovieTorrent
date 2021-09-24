"""torrent URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from torrent.authapi.views import ( FacebookLogin,TwitterLogin,GithubLogin,GoogleLogin,FacebookConnect,TwitterConnect,GithubConnect,)
# from torrentapp.views import MySignupView
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', TemplateView.as_view(template_name="index.html"), name='index'),

    path('', include("torrentapp.urls")),
    path('api/', include("torrentapp.api.urls")),
    path('accounts/', include("allauth.urls")),
#    path('accounts/signup', MySignupView.as_view(),name="account_signup")
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),

    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('dj-rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('dj-rest-auth/twitter/', TwitterLogin.as_view(), name='twitter_login'),
    path('dj-rest-auth/github/', GithubLogin.as_view(), name='github_login'),
    path('dj-rest-auth/google', GoogleLogin.as_view(), name='google_login'),

]
urlpatterns += [
    path('dj-rest-auth/facebook/connect/', FacebookConnect.as_view(), name='fb_connect'),
    path('dj-rest-auth/twitter/connect/', TwitterConnect.as_view(), name='twitter_connect'),
    path('dj-rest-auth/github/connect/', GithubConnect.as_view(), name='github_connect'),
]

from dj_rest_auth.registration.views import (
    SocialAccountListView, SocialAccountDisconnectView
)

urlpatterns += [
    path(
        'socialaccounts/',
        SocialAccountListView.as_view(),
        name='social_account_list'
    ),
    path(
        'socialaccounts/<int:pk>/disconnect/',
        SocialAccountDisconnectView.as_view(),
        name='social_account_disconnect'
    )
]
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
#    import debug_toolbar
#    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
