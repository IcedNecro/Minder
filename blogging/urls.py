__author__ = 'roman'
from django.conf.urls import include, url

from . import views

urlpatterns = [
    url(r'^page/$', views.render_home_form, name='home'),
    url(r'^upload_avatar/$', views.save_avatar, name='upload_avatar'),
    url(r'^postmind/$', views.create_mind),
    url(r'^categories/$', views.MindsList.as_view()),
    url(r'^minds/$', views.get_mind_tree),
    url(r'^categories/create/$', views.create_category),
    url(r'^minds/(?P<mind_id>[0-9]+)/$', views.get_single_mind),
    url(r'^minds/delete/$', views.delete_mind),
    url(r'^minds/update/$', views.update_mind),
    url(r'^like/$', views.put_rate)
]
