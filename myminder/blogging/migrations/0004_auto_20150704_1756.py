# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('blogging', '0003_auto_20150704_1755'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='following',
            field=models.ForeignKey(related_name='follower', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
