from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0001_initial'),
    ]

    operations = [
        # --- Client Model Changes ---
        migrations.AddField(
            model_name='client',
            name='adresse',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='client',
            name='ville',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='client',
            name='code_postal',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='client',
            name='pays',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),

        # --- Affilie Model Changes ---
        migrations.AddField(
            model_name='affilie',
            name='nom',
            field=models.CharField(default='Affilié', help_text="Nom de l'affilié ou de la campagne (ex: PROMO_NOEL)", max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='affilie',
            name='pourcentage_commission',
            field=models.DecimalField(decimal_places=2, default=10.0, help_text='Pourcentage de commission (ex: 10.00 pour 10%)', max_digits=5),
        ),
        migrations.AddField(
            model_name='affilie',
            name='type_affilie',
            field=models.CharField(choices=[('CLIENT', 'Client'), ('EVENEMENT', 'Événement')], default='CLIENT', max_length=10),
        ),
        migrations.AlterField(
            model_name='affilie',
            name='client',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='crm.client', unique=True),
        ),
        migrations.AlterField(
            model_name='affilie',
            name='code_affiliation',
            field=models.CharField(blank=True, max_length=50, unique=True),
        ),

        # --- Commande Model Changes ---
        migrations.AddField(
            model_name='commande',
            name='affilie_utilise',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='commandes_generees', to='crm.affilie'),
        ),
        migrations.AddField(
            model_name='commande',
            name='montant_commission',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=8),
        ),
    ]