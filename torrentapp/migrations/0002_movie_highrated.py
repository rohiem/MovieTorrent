# Generated by Django 2.2.10 on 2020-06-16 14:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('torrentapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='highrated',
            field=models.BooleanField(default=False),
        ),
    ]
