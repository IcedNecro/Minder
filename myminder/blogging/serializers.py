__author__ = 'python'

from rest_framework import serializers
from . import models

class MindSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.Mind
        fields = ['title', 'text', 'author']

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = models.MindCategory
        fields = ['id', 'category_title']