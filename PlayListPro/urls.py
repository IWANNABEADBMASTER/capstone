from django.urls import path
from . import views

urlpatterns = [
    path("main", views.main),
    path("login", views.login),
    path("logout", views.logout),
    path("signup", views.signup),
    path("search", views.search),
]
