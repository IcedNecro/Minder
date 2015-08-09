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
        name = self.request.QUERY_PARAMS['name']
        filtered = models.MindCategory.objects.filter(category_title__contains=name)
        return filtered

def get_root_uid(node):
    if node.parent:
        return get_root_uid(node.parent)
    else:
        return node.author.id

@login_required
@api_view(['GET',])
def get_mind_tree(request):

    uid = request.query_params.get('id')
    if not uid:
        uid = request.user.id

    uid = int(uid)
    minds_list = models.Mind.objects.filter(author_id=uid)
    mind_categories = minds_list.values_list('category', flat=True).distinct()

    mind_categories = models.MindCategory.objects.filter(pk__in=mind_categories)
    result = {'nodes': [{'title':cat.category_title, 'type':'category', 'id': cat.id} for cat in mind_categories], 'links': []}
    id_map = {'cat_'+str(mind_categories[i].id): i for i in range(len(mind_categories))}
    i = len(mind_categories)

    links = []

    minds_list = [mind for mind in minds_list]

    for mind in minds_list:
        children = mind.get_children()
        for c in children:
            if c not in minds_list:
                minds_list.append(c)
        count = mind.likes.filter(positive=True).count()
        result['nodes'].append({
            'title': mind.title,
            'id': mind.id,
            'type': 'mind',
            'value': count,
            'authored': mind.author.id == uid,
        })
        id = 'mind_'+str(mind.id)
        id_map[id] = i
        i += 1

    for mind in minds_list:
        curr_mind_id = 'mind_'+str(mind.id)
        index_to = id_map[curr_mind_id]

        if mind.parent is not None and ((get_root_uid(mind.parent) == uid) or (mind.parent.author.id == uid)):
            mind_id = 'mind_'+str(mind.parent.id)
            index = id_map[mind_id]
            links.append({'source': index, 'target': index_to})
        else:
            for cat in mind.category.values():
                cat_id = 'cat_'+str(cat['id'])
                index = id_map[cat_id]
                links.append({'source': index, 'target': index_to})

    result['links'] = links
    return Response(result)


@login_required
def render_home_form(request):
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
    if request.method == 'POST':
        parent_id = request.query_params.get('submind')
        id = request.user.id
        user = get_user_model().objects.get(pk=id)
        data = request.data

        if parent_id:
            parent = models.Mind.objects.get(pk=parent_id)
            mind = models.Mind.objects.create(author=user, title=data['title'], text=data['text'], parent=parent)
            categories = parent.category.all()
        else:
            categories = models.MindCategory.objects.filter(pk__in=data["categories"])
            mind = models.Mind.objects.create(author=user, title=data['title'], text=data['text'], parent=None)

        for c in categories:
            mind.category.add(c)

        mind.save()
        return Response(status=status.HTTP_201_CREATED)

@api_view(['GET',])
def get_single_mind(request, mind_id):
    mind = models.Mind.objects.get(pk=mind_id)
    serialized_mind = serializers.MindSerializer(mind).data

    liked = mind.likes.filter(positive=True).count()
    dislikes = mind.likes.filter(positive=False).count()

    res = {
        'mind': serialized_mind,
        'likes': liked,
        'dislikes': dislikes
    }

    return Response(res)

@login_required
@api_view(['POST',])
def put_rate(request):
    if request.method == 'POST':
        id = request.user.id
        mind_id = request.query_params.get('mind_id')
        positive = request.query_params.get('positive')
        author = models.CustomUser.objects.get(pk=id)
        mind = models.Mind.objects.get(pk=mind_id)

        obj, created = models.Like.objects.get_or_create(mind=mind, liked=author, positive=positive)
        if not created :
            obj.delete()

        return Response(status=status.HTTP_202_ACCEPTED)