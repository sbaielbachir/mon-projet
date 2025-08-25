from django.apps import AppConfig


class CrmConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'crm'

    def ready(self):
        import crm.models # Importer les signaux