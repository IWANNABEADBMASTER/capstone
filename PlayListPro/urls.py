from django.urls import path

from . import views

urlpatterns = [
    path('', views.index),
    path('main', views.index),
    path('login', views.login),
]