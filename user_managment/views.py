
from django.contrib.auth import get_user_model, logout
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.response import Response
from . import serializers
from . import util
import json

@api_view(['GET',])
def get_users_by_name(request):

    name_shortcut = request.query_params.get('name')
    user_list = get_user_model().objects.filter(username__contains=name_shortcut)
    following = get_user_model().objects.get(pk=request.user.id).following.all()
    ls = []

    for u in user_list:
        if u in following:
            ls.append({'alreadySubscribed': True, 'user': serializers.UserSerializer(u).data})
        else:
            ls.append({'alreadySubscribed': False, 'user': serializers.UserSerializer(u).data})
    return Response(ls, status=status.HTTP_200_OK)

@api_view(['GET',])
def get_user_stats(request):
    #import ipdb; ipdb.set_trace()
    if request.method == 'GET':

        id = request.QUERY_PARAMS.dict().get('id')
        if id is None:
            id = request.user.id

        user = get_user_model().objects.get(pk=id)
        minds = user.author.count()
        following = user.following.count()
        followers = user.followers.count()

        return Response(serializers.StatsSerializer(util.Stats(minds, following, followers, user)).data)

class FollowingUsers(generics.ListAPIView):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        user = get_user_model().objects.get(pk=self.request.user.id)
        subscribed_list = user.following
        return subscribed_list

class Followers(generics.ListAPIView):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        user = get_user_model().objects.get(pk=self.request.user.id)
        followers_list = user.followers
        return followers_list


def log_out_user(request):
    logout(request)
    return HttpResponseRedirect(reverse('auth:login', args=()))

@api_view(['POST',])
def subscribe(request):

    if request.method == 'POST':
        user = get_user_model().objects.get(pk=request.user.id)

        to_subscribe = get_user_model().objects.get(pk=request.GET['id'])
        try:
            user.following.get(pk=request.GET['id'])
            user.following.remove(to_subscribe)
            to_subscribe.followers.remove(user)
        except :
            user.following.add(to_subscribe)
            to_subscribe.followers.add(user)
        user.save()
        to_subscribe.save()
        return Response(status=status.HTTP_200_OK)

@api_view(['GET',])
def get_subscribers_graph(request):

    if request.method == 'GET':
        resp = {'nodes':[], 'links':[]}
        u_id = request.QUERY_PARAMS.dict().get('id')
        if u_id is None:
            u_id = request.user.id

        user = get_user_model().objects.get(pk=u_id)
        resp['nodes'].append(user)
        following = user.following.all()
        i=1
        for f in following:
            resp['nodes'].append(f)
            resp['links'].append({'source':i, 'target':0, 'value':20})
            i+=1
        buffer = [serializers.UserSerializer(user).data]

        for i in range(1,len(resp['nodes'])):
            u = resp['nodes'][i]
            following = u.following.all()

            for f in following:
                try:
                    index = resp['nodes'].index(f)
                    resp['links'].append({'source':i, 'target':index, 'value':10})
                except:
                    pass

            buffer.append(serializers.UserSerializer(u).data)

        resp['nodes'] = buffer

        return Response(resp)

@api_view(['GET',])
def get_followers_graph(request):

    if request.method == 'GET':
        resp = {'nodes':[], 'links':[]}

        u_id = request.QUERY_PARAMS.dict().get('id')
        if u_id is None:
            u_id = request.user.id

        user = get_user_model().objects.get(pk=u_id)
        resp['nodes'].append(user)
        followers = user.followers.all()
        i=1
        for f in followers:
            resp['nodes'].append(f)
            resp['links'].append({'source':i, 'target':0, 'value':20})
            i+=1
        buffer = [serializers.UserSerializer(user).data]

        for i in range(1,len(resp['nodes'])):
            u = resp['nodes'][i]
            following = u.following.all()

            for f in following:
                try:
                    index = resp['nodes'].index(f)
                    resp['links'].append({'source':i, 'target':index, 'value':10})
                except:
                    pass

            buffer.append(serializers.UserSerializer(u).data)

        resp['nodes'] = buffer

        return Response(resp)