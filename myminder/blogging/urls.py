__author__ = 'roman'
from django.conf.urls import include, url

from . import views

urlpatterns = [
    url(r'^page/', views.render_home_form, name='home'),
    url(r'^upload_avatar/', views.save_avatar, name='upload_avatar'),
    url(r'^postmind/', views.create_mind),
    url(r'^categories/', views.MindsList.as_view()),
    url(r'^minds/$', views.get_mind_tree),
    url
]
