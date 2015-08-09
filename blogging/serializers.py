__author__ = 'python'

from rest_framework import serializers
from . import models


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ['id', 'username', 'image_url']

class MindSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer()

    class Meta:
        fields = ['id', 'title', 'text', 'author']
        model = models.Mind

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = models.MindCategory
        fields = ['id', 'category_title']