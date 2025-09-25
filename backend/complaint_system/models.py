from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import AbstractUser



class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('USER', 'Regular User'),
        ('WORKER', 'Worker'),
        ('ADMIN', 'Administrator'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='USER')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"

class Worker(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="worker_profile")
    is_available = models.BooleanField(default=True)
    current_location = models.CharField(max_length=255, blank=True, null=True)
    max_active_complaints = models.IntegerField(default=3)
    active_complaint_count = models.IntegerField(default=0)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    def __str__(self):
        return f"Worker: {self.user.username}"


from django.db import models
from django.utils import timezone
from django.core.validators import MinLengthValidator
from .models import CustomUser  # adjust import if needed

class Complaint(models.Model):
    CATEGORY_CHOICES = [
        ("DOG", "Dog Nuisance"),
        ("GARBAGE", "Garbage Issue"),
    ]

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("RESOLVED", "Resolved"),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="complaints")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(validators=[MinLengthValidator(10)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Complaint #{self.id} - {self.get_category_display()} - {self.status}"



class Notification(models.Model):
    """Model to track notifications sent to workers"""
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name="notifications")
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Notification for {self.worker.user.username} - Complaint #{self.complaint.id}"


class ComplaintAssignmentLog(models.Model):
    """Log for tracking assignment attempts and results"""
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="assignment_logs")
    attempted_worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name="assignment_attempts")
    attempted_at = models.DateTimeField(default=timezone.now)
    was_assigned = models.BooleanField(default=False)
    reason = models.TextField(blank=True, null=True)  # Why assignment succeeded/failed
    
    def __str__(self):
        return f"Assignment log for Complaint #{self.complaint.id}"


# Remove AdminDashboard model - better to calculate metrics dynamically
# You can create a view or manager methods instead

class ComplaintManager(models.Manager):
    def get_dashboard_stats(self):
        """Get statistics for admin dashboard"""
        total_complaints = self.count()
        resolved_complaints = self.filter(status="RESOLVED").count()
        pending_complaints = self.filter(status="PENDING").count()
        in_progress_complaints = self.filter(status="IN_PROGRESS").count()
        
        return {
            'total_complaints': total_complaints,
            'resolved_complaints': resolved_complaints,
            'pending_complaints': pending_complaints,
            'in_progress_complaints': in_progress_complaints,
            'resolution_rate': (resolved_complaints / total_complaints * 100) if total_complaints > 0 else 0
        }

# Add the manager to Complaint model
Complaint.objects = ComplaintManager()