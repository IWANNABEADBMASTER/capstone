from django.urls import path

from . import views

urlpatterns = [
    path('', views.main),
    path('search', views.search),
    path('myplaylist', views.myplaylist),
    path('profile', views.profile),
    path('profileUpdate', views.profileUpdate),
    path('passwordUpdate', views.passwordUpdate),
    path('login', views.login),
    path('signup', views.signup),
    path('topSong', views.topSong),
]