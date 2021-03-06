__author__ = 'roman'

from django.conf.urls import include, url
from views import *
from . import views

urlpatterns = [
    url(r'^get/', views.get_users_by_name),
    url(r'^following/', views.FollowingUsers.as_view()),
    url(r'^followers/', views.Followers.as_view()),
    url(r'^log_out/', views.log_out_user),
    url(r'^subscribe/', views.subscribe),
    url(r'^stats/', views.get_user_stats),
    url(r'^graph/subscribers/', views.get_subscribers_graph),
    url(r'^graph/followers/', views.get_followers_graph)

]
