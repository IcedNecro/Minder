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
from django.contrib.auth.decorators import login_required

import os

class MindsList(generics.ListAPIView):
    serializer_class = serializers.CategorySerializer

    def get_queryset(self):
        #import ipdb; ipdb.set_trace()
        name = self.request.QUERY_PARAMS['name']
        filtered = models.MindCategory.objects.filter(category_title__contains=name)
        return filtered

@login_required
@api_view(['GET',])
def get_mind_tree(request):

    try:
        uid = request.user.id
    except:
        uid = request.query_params.get('uid')

    #import ipdb; ipdb.set_trace()
    minds_list = models.Mind.objects.filter(author_id=uid)
    mind_categories = minds_list.values_list('category', flat=True).distinct()

    mind_categories = models.MindCategory.objects.filter(pk__in=mind_categories)
    result = {'nodes': [{'title':cat.category_title, 'type':'category', 'id': cat.id} for cat in mind_categories], 'links': []}
    id_map = {'cat_'+str(mind_categories[i].id): i for i in range(len(result))}
    i = len(mind_categories)

    links = []

    for mind in minds_list:
        result['nodes'].append({
            'title': mind.title,
            'id': mind.id,
            'type': 'mind'
        })
        id = 'mind_'+str(mind.id)
        if mind.parent:
            mind_id = 'mind_'+str(mind.parent.id)
            index = id_map[mind_id]
            links.append({'source': index, 'target': i})
        for cat in mind.category.values():
            cat_id = 'cat_'+str(cat['id'])
            index = id_map[cat_id]
            links.append({'source': index, 'target': i})
        id_map[id] = i
        i += 1
    result['links'] = links
    return Response(result)


@login_required
def render_home_form(request):
    #import ipdb; ipdb.set_trace()
    template = loader.get_template('templates/home.html')
    form = UploadAvatarForm(request.POST, request.FILES)
    context = RequestContext(request, {
        'user': request.user.username,
        'avatar_url': request.user.image_url,
        'avatar_form': form,
    })

    return HttpResponse(template.render(context))

@login_required
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

@login_required
@api_view(['POST',])
def create_mind(request):
    #import ipdb; ipdb.set_trace()
    if request.method == 'POST':
        id = request.user.id
        user = get_user_model().objects.get(pk=id)
        data = request.data
        categories = models.MindCategory.objects.filter(pk__in=data["categories"])

        mind = models.Mind.objects.create(author=user, title=data['title'], text=data['text'], parent=None)
        for c in categories:
            mind.category.add(c)

        mind.save()
        return Response(status=status.HTTP_201_CREATED)
