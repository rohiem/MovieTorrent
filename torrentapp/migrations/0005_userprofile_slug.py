# Generated by Django 2.2.10 on 2020-06-16 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('torrentapp', '0004_auto_20200616_1715'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='slug',
            field=models.SlugField(blank=True),
        ),
    ]
