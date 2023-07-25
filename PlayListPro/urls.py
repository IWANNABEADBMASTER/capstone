from django.urls import path
from . import views

urlpatterns = [
    path("main", views.main),
    path("login", views.login),
    path("spotify_url", views.spotify_url),
    path("signup", views.signup),
    path("update", views.update),
    path("search", views.search),
]
