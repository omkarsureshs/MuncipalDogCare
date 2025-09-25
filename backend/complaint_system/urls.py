
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    # Routers
    ComplaintViewSet,
    WorkerViewSet,
    UserViewSet,
    
    # Auth
    UserLoginView,
    UserRegistrationView,
    UserProfileView,
    
    # Admin
    AdminUserManagementView,
    WorkerManagementView,
    
    # Dashboard & Stats
    DashboardStats,
    
    # Complaints
    AssignComplaint,
    UpdateComplaintStatus,
    ValidateComplaintAI,
    UserComplaints,
    WorkerComplaints,
    AutoAssignComplaint,
    
    # Workers
    UpdateWorkerAvailability,
    AvailableWorkers,
    
    # Notifications
    UserNotifications,
)

# DRF Router for standard CRUD endpoints
router = DefaultRouter()
router.register(r'complaints', ComplaintViewSet, basename='complaint')
router.register(r'workers', WorkerViewSet, basename='worker')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Auth endpoints
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Admin management
    path('admin/users/', AdminUserManagementView.as_view(), name='admin-users'),
    path('admin/workers/', WorkerManagementView.as_view(), name='admin-workers'),

    # Dashboard
    path('dashboard/stats/', DashboardStats.as_view(), name='dashboard-stats'),

    # Complaint-related
    path('complaints/<int:pk>/assign/', AssignComplaint.as_view(), name='assign-complaint'),
    path('complaints/<int:pk>/status/', UpdateComplaintStatus.as_view(), name='update-complaint-status'),
    path('complaints/<int:pk>/validate-ai/', ValidateComplaintAI.as_view(), name='validate-complaint-ai'),
    path('complaints/<int:pk>/auto-assign/', AutoAssignComplaint.as_view(), name='auto-assign-complaint'),
    path('my-complaints/', UserComplaints.as_view(), name='user-complaints'),
    path('worker-complaints/', WorkerComplaints.as_view(), name='worker-complaints'),

    # Worker-related
    path('workers/<int:pk>/availability/', UpdateWorkerAvailability.as_view(), name='update-worker-availability'),
    path('workers/available/', AvailableWorkers.as_view(), name='available-workers'),

    # Notifications
    path('my-notifications/', UserNotifications.as_view(), name='user-notifications'),

    # Router endpoints (CRUD for complaints, workers, users)
    path('', include(router.urls)),
]
