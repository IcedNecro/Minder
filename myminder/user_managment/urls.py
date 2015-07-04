__author__ = 'roman'

from django.conf.urls import include, url
from views import *
from . import views

urlpatterns = [
    url('^get/', views.UserViewSet.as_view()),
    url('^log_out/', views.logout),
    url(r'^subscribe/', views.subscribe)
]
