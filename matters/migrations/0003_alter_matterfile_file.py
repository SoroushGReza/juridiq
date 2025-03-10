# Generated by Django 4.2.17 on 2025-01-08 13:37

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("matters", "0002_alter_matter_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="matterfile",
            name="file",
            field=models.FileField(
                upload_to="matter_files/",
                validators=[
                    django.core.validators.FileExtensionValidator(
                        allowed_extensions=["pdf", "txt", "jpg", "png"]
                    )
                ],
            ),
        ),
    ]
