# test_complaint.py (create this file in your project root)
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from complaint_system.models import Complaint, CustomUser

print("=== Testing Complaint Model ===")

# Test 1: Check field access
complaint = Complaint()
print("Can set user field:", hasattr(complaint, 'user'))

# Test 2: Check field descriptor
user_field = Complaint._meta.get_field('user')
print("Field details:", user_field.name, user_field.related_model)

# Test 3: Try to create a query without using the ORM
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute("SELECT user_id FROM complaint_system_complaint LIMIT 1")
    print("Direct SQL works:", cursor.fetchone())

print("Test completed")