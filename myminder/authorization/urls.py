__author__ = 'roman'
from django.conf.urls import include, url

from . import views

urlpatterns = [
    url(r'^registration/', views.render_registration_form, name="registration"),
    url(r'^login/', views.render_login_form, name="login"),
    url(r'^add_user/', views.retrieve_registration_form, name="confirm_reqistration"),
    url(r'^success_login/', views.retrieve_login_form, name="success_login"),

]
