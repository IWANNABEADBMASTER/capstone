from django.db import models
from django.contrib.auth.models import AbstractUser


class Users(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    name = models.CharField(db_column="name", max_length=255, default="")
    password = models.CharField(max_length=128, db_column="password")
    email = models.CharField(max_length=255, default="")

    def __str__(self):
        return self.username


class Playlist(models.Model):
    playlistId = models.AutoField(primary_key=True)
    userId = models.CharField(max_length=255)
    playlistname = models.CharField(max_length=255)
    playlistcomment = models.TextField()

    def __str__(self):
        return self.playlistname


class Music(models.Model):
    musicId = models.AutoField(primary_key=True)
    playlistId = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    trackId = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=255)
    album_img = models.URLField()
    artist = models.CharField(max_length=255)
    time = models.CharField(max_length=10)

    def __str__(self):
        return self.title
