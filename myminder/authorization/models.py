from django.db import models

from django import forms
# Create your models here.

class LoginForm(forms.Form):
    login = forms.CharField(label="Login", max_length=100, required=True)
    password = forms.CharField(max_length=32, widget=forms.PasswordInput, required=True)

