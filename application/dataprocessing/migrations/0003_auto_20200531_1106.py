# Generated by Django 2.2.6 on 2020-05-31 11:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dataprocessing', '0002_auto_20200506_1602'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='items',
            options={'verbose_name_plural': 'Учебные сущности'},
        ),
        migrations.AlterModelOptions(
            name='relation',
            options={},
        ),
        migrations.AddField(
            model_name='items',
            name='relation_with_item',
            field=models.ManyToManyField(through='dataprocessing.Relation', to='dataprocessing.Items', verbose_name='Пользователи'),
        ),
        migrations.AlterField(
            model_name='items',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Автор', to=settings.AUTH_USER_MODEL, verbose_name='Пользователи'),
        ),
    ]
