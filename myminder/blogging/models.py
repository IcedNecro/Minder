from django.contrib.auth import models
from django.db import models as md
from django.contrib.auth.models import BaseUserManager

from mptt.models import MPTTModel
from mptt.models import TreeForeignKey

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
    image_url = md.CharField(max_length=100,default="/static/users/default/avatar.svg")
    email = md.CharField(max_length=100)
    objects = CustomUserManager()
    is_staff = md.BooleanField(default=False)
    is_active = md.BooleanField(default=True)
    is_superuser = md.BooleanField(default=False)
    following = md.ManyToManyField('self', symmetrical=False, null=True, blank=True, related_name='following_set')
    followers = md.ManyToManyField('self', symmetrical=False, blank=True, null=True, related_name='followers_set')

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

class MindCategory(md.Model):
    authors = md.ManyToManyField(CustomUser, related_name='categories',blank=True, null=True,)
    category_title = md.TextField(max_length=100)

    def __unicode__(self):
        return self.category_title

class Mind(MPTTModel):
    title = md.CharField(max_length=100)
    text = md.CharField(max_length=2048)
    author = md.ForeignKey(CustomUser, related_name='author')
    category = md.ManyToManyField(MindCategory, related_name='minds_related', blank=True, null=True)
    parent = TreeForeignKey('self', null=True)

    def __unicode__(self):
        return self.title