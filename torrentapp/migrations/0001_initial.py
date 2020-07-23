# Generated by Django 2.2.10 on 2020-07-23 13:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('desc', models.TextField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(choices=[('AC', 'Action'), ('DR', 'Drama'), ('SP', 'Sport'), ('RO', 'Romance'), ('AN', 'Anime'), ('BI', 'Biography'), ('CO', 'Comedy'), ('HO', 'Horror')], default='AC', max_length=2)),
                ('name', models.CharField(max_length=100)),
                ('year', models.IntegerField()),
                ('torrent', models.FileField(upload_to='torrent')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('description', models.TextField(max_length=2000)),
                ('image', models.ImageField(blank=True, null=True, upload_to='image')),
                ('new', models.BooleanField(default=False)),
                ('mostwatch', models.BooleanField(default=False)),
                ('highrated', models.BooleanField(default=False)),
                ('slug', models.SlugField(blank=True, null=True)),
                ('likes', models.ManyToManyField(related_name='movies', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(default=1, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first', models.CharField(max_length=50)),
                ('last', models.CharField(max_length=50)),
                ('bio', models.TextField(default='hello', max_length=1400)),
                ('picture', models.ImageField(blank=True, null=True, upload_to='profile')),
                ('slug', models.SlugField(blank=True)),
                ('movies', models.ManyToManyField(to='torrentapp.Movie')),
                ('user', models.OneToOneField(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('body', models.TextField(max_length=2000)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='torrentapp.Movie')),
            ],
        ),
    ]
