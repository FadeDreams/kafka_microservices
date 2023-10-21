from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True)
    credit = models.DecimalField(max_digits=10, decimal_places=2, default=1000000)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class Reset(models.Model):
    email = models.EmailField(max_length=255)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True, unique=True)
    

