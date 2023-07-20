from django.urls import path
from . import views

urlpatterns = [
    path("main", views.main),
    path("login", views.login),
    path("spotify_login", views.spotify_login),
    path("logout", views.logout),
    path("signup", views.signup),
    path("update", views.update),
    path("search", views.search),
]
