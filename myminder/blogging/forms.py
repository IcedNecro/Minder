__author__ = 'roman'

from django import forms

class UploadAvatarForm(forms.Form):
    avatar = forms.FileField(label='Choose your avatar')