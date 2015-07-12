from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from forms import UploadAvatarForm
from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from rest_framework.decorators import api_view
from . import serializers
from rest_framework.response import Response
from rest_framework import status, generics
from . import models

import os

class MindsList(generics.ListAPIView):
    serializer_class = serializers.CategorySerializer

    def get_queryset(self):
        #import ipdb; ipdb.set_trace()
        name = self.request.QUERY_PARAMS['name']
        filtered = models.MindCategory.objects.filter(category_title__contains=name)
        return filtered

def render_home_form(request):
    template = loader.get_template('templates/home.html')
    form = UploadAvatarForm(request.POST, request.FILES)
    context = RequestContext(request, {
        'user': request.user.username,
        'avatar_url': request.user.image_url,
        'avatar_form': form,
    })

    return HttpResponse(template.render(context))

def save_avatar(request):

    if request.method == 'POST':
        name = str(request.user)
        user = get_user_model().objects.get(username=name)

        file = (request.FILES['avatar'])
        if not os.path.exists('static/users/'+name): os.makedirs('static/users/'+name)

        avatar_url = 'static/users/'+name+'/avatar'+str(file)[str(file).rfind('.'):]
        with open(avatar_url, 'w+') as f:
            for c in file.chunks():
                f.write(c)
        user.image_url = '/'+avatar_url
        user.save()

    return HttpResponseRedirect(reverse('blog:home', args=()))

@api_view(['POST',])
def create_mind(request):
    #import ipdb; ipdb.set_trace()
    if request.method == 'POST':
        id = request.user.id
        user = get_user_model().objects.get(pk=id)
        data = request.data
        categories = models.MindCategory.objects.filter(pk__in=data["categories"])

        mind = models.Mind.objects.create(author=user, title=data['title'], text=data['text'])
        for c in categories:
            mind.category.add(c)

        mind.save()
        return Response(status=status.HTTP_201_CREATED)
