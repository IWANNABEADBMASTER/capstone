from django.db import models
from django.contrib.auth.models import AbstractUser


class Users(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    name = models.CharField(
        db_column="name", max_length=255, default=""
    )  # Field name made lowercase.
    password = models.CharField(max_length=255)
    email = models.CharField(max_length=255, default="")

    def __str__(self):
        return self.username
