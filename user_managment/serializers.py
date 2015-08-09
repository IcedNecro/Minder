__author__ = 'roman'

from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'image_url')

class StatsSerializer(serializers.Serializer):
    minds = serializers.IntegerField()
    followers = serializers.IntegerField()
    following = serializers.IntegerField()
    user = UserSerializer()
