
from django.contrib.auth import get_user_model, logout
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.response import Response
from . import serializers
from . import util

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
        try:
            id = request.get['id']
        except:
            id = request.user.id

        user = get_user_model().objects.get(pk=id)
        minds = 0
        following = user.following.count()
        followers = user.followers.count()

        return Response(serializers.StatsSerializer(util.Stats(minds, following, followers)).data)

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

        #import ipdb; ipdb.set_trace()

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


