# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('blogging', '0008_auto_20150704_1927'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='followers',
        ),
        migrations.AddField(
            model_name='customuser',
            name='followers',
            field=models.ManyToManyField(related_name='followers_set', null=True, to=settings.AUTH_USER_MODEL, blank=True),
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='following',
        ),
        migrations.AddField(
            model_name='customuser',
            name='following',
            field=models.ManyToManyField(related_name='following_set', null=True, to=settings.AUTH_USER_MODEL, blank=True),
        ),
    ]
