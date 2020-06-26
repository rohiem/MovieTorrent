# Generated by Django 2.2.10 on 2020-06-16 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('torrentapp', '0005_userprofile_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='movies',
        ),
        migrations.AddField(
            model_name='userprofile',
            name='first',
            field=models.CharField(default='first name', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='userprofile',
            name='last',
            field=models.CharField(default='last name', max_length=50),
            preserve_default=False,
        ),
    ]
