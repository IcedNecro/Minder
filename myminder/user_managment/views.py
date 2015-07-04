
from django.contrib.auth import get_user_model, logout
from rest_framework import generics
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse

from . import serializers

# Create your views here.

class UserViewSet(generics.ListAPIView):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        name_shortcut = self.request.query_params.get('name')
        user_list = get_user_model().objects.filter(username__contains=name_shortcut)
        return user_list

def log_out_user(request):
    logout(request)
    return HttpResponseRedirect(reverse('auth:login', args=()))

