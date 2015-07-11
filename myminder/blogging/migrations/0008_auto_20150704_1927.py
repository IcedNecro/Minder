# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('blogging', '0007_auto_20150704_1905'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='followers',
        ),
        migrations.AddField(
            model_name='customuser',
            name='followers',
            field=models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='following',
        ),
        migrations.AddField(
            model_name='customuser',
            name='following',
            field=models.ForeignKey(related_name='following_key', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
