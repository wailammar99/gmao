# Generated by Django 5.0.1 on 2024-02-29 10:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_interventions_delete_intervention'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interventions',
            name='date_creation',
            field=models.DateField(default=datetime.datetime(2024, 2, 29, 11, 57, 26, 815566)),
        ),
    ]
