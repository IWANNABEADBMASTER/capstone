# Generated by Django 4.2.2 on 2023-07-05 04:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PlayListPro', '0005_alter_users_managers_remove_users_userid_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='users',
            name='userid',
        ),
        migrations.AddField(
            model_name='users',
            name='name',
            field=models.CharField(db_column='name', default='', max_length=255),
        ),
    ]
