from django.contrib.auth import models
from django.db import models as md
from django.contrib.auth.models import BaseUserManager

# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password, **extra_fields):
        user = self.model(username=username, email=email)
        user.set_password(password)
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True

        user.save()
        return user

    def create_superuser(self,username, email, password, **extras):
        u = self.create_user(username, email, password, extras)
        u.is_staff = True
        u.is_active = True
        u.is_superuser = True
        u.save()
        return u

class CustomUser(models.AbstractBaseUser):
    username = md.CharField(max_length=40, unique=True)
    image_url = md.CharField(max_length=100)
    email = md.CharField(max_length=100)
    objects = CustomUserManager()
    is_staff = md.BooleanField(default=True)
    is_active = md.BooleanField(default=True)
    is_superuser = md.BooleanField(default=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', username]

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

