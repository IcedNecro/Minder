from django.db import models
from django.contrib.auth import get_user_model

from django import forms

class LoginForm(forms.Form):
    login = forms.CharField(label="Login", max_length=100, required=True)
    password = forms.CharField(max_length=32, widget=forms.PasswordInput, required=True)

class RegistrationForm(forms.Form):
    login = forms.CharField(label='Your Login', required=True)
    password = forms.CharField(widget=forms.PasswordInput, required=True)
    confirmPassword = forms.CharField(widget=forms.PasswordInput, required=True)

    def is_valid(self):
        password = self.data.get('password')
        confirmPassword = self.data.get('confirmPassword')
        login = self.data.get('login')
        if password == confirmPassword:
            if len(password) == 0 or len(login) == 0:
                return False, 'fill required fields'.format(login)

            else:
                try:
                    get_user_model().objects.get(username=login)
                    return False, 'User with login {} already exists'.format(login)
                except:
                    return True, ''
        else:
            return False, "password and confirm password doesn't match"
