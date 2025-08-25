from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from crm.models import Abonnement
from crm.views import send_renewal_reminder_email

class Command(BaseCommand):
    help = 'Envoie des e-mails de rappel pour les abonnements arrivant à expiration.'

    def handle(self, *args, **options):
        today = timezone.now().date()
        self.stdout.write(f"Vérification des abonnements pour le {today}...")

        # Définir les intervalles de rappel en jours
        reminder_intervals = [7, 3, 1]
        sent_count = 0

        for days_left in reminder_intervals:
            expiration_date = today + timedelta(days=days_left)
            
            # On cherche les abonnements actifs qui expirent exactement à cette date
            subscriptions_to_remind = Abonnement.objects.filter(
                statut='actif',
                date_fin__year=expiration_date.year,
                date_fin__month=expiration_date.month,
                date_fin__day=expiration_date.day
            )

            if subscriptions_to_remind.exists():
                self.stdout.write(self.style.SUCCESS(f"Trouvé {subscriptions_to_remind.count()} abonnements expirant dans {days_left} jour(s)."))
                for sub in subscriptions_to_remind:
                    send_renewal_reminder_email(sub, days_left)
                    sent_count += 1
            else:
                self.stdout.write(f"Aucun abonnement expirant dans {days_left} jour(s).")
        
        self.stdout.write(self.style.SUCCESS(f"Terminé. {sent_count} e-mails de rappel ont été envoyés."))