from django.db import migrations, models
import django.utils.timezone

class Migration(migrations.Migration):
    dependencies = [
        ('crm', '0005_client_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticketsupport',
            name='date_mise_a_jour',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]