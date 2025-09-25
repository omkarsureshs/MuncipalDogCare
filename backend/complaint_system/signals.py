# complaint_system/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import CustomUser, Complaint, Notification, Worker

@receiver(post_save, sender=Complaint)
def handle_new_complaint(sender, instance, created, **kwargs):
    if created:
        # Trigger AI validation process (you can call your AI service here)
        # For now, let's do basic validation
        if len(instance.description) >= 10:
            instance.is_ai_validated = True
            instance.ai_validation_score = min(len(instance.description) / 100, 1.0)
            instance.ai_feedback = "Description validated successfully"
            instance.validated_description = instance.description
        else:
            instance.is_ai_validated = False
            instance.ai_validation_score = 0.0
            instance.ai_feedback = "Description too short. Minimum 10 characters required."
        
        instance.save()
        
        # Auto-assign to nearest available worker (basic implementation)
        available_workers = Worker.objects.filter(is_available=True)
        if available_workers.exists():
            worker = available_workers.first()  # Simple assignment - improve with location logic
            instance.assigned_worker = worker
            instance.status = 'ASSIGNED'
            instance.assigned_at = timezone.now()
            instance.save()
            
            # Create notification for worker
            Notification.objects.create(
                worker=worker,
                complaint=instance,
                message=f"New complaint assigned to you: {instance.get_category_display()}"
            )