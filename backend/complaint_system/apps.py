# complaint_system/apps.py
from django.apps import AppConfig

class ComplaintSystemConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'complaint_system'
    
    def ready(self):
        import complaint_system.signals  # This connects the signals