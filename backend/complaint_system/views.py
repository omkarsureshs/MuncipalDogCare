# complaint_system/views.py
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone  # ADD THIS IMPORT
from .models import CustomUser, Complaint, Worker, Notification
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    ComplaintSerializer, WorkerSerializer, NotificationSerializer
)
from .permissions import IsAdminUser, IsWorkerUser, IsRegularUser, IsAdminOrWorker

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt



# Authentication Views
class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'User registered successfully',
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            if user.is_active:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': 'Login successful',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role
                    },
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Account disabled'}, 
                              status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_400_BAD_REQUEST)

class UserLogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        """Partial update of user profile"""
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Admin Management Views
class AdminUserManagementView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data)

class WorkerManagementView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        workers = Worker.objects.all()
        serializer = WorkerSerializer(workers, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        user_id = request.data.get('user_id')
        try:
            user = CustomUser.objects.get(id=user_id)
            if user.role != 'WORKER':
                user.role = 'WORKER'
                user.save()
                worker, created = Worker.objects.get_or_create(user=user)
                return Response({
                    'message': 'User promoted to worker successfully',
                    'worker': WorkerSerializer(worker).data
                }, status=status.HTTP_200_OK)
            return Response({'message': 'User is already a worker'}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

from rest_framework import viewsets, permissions
from .models import Complaint
from .serializers import ComplaintSerializer

from complaint_system.models import Complaint

class ComplaintViewSet(viewsets.ModelViewSet):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Complaint.objects.all()  # <-- add this default

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Complaint.objects.all()
        return Complaint.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    permission_classes = [IsAdminUser]  # Only admin can manage workers
    
    @action(detail=True, methods=['post'])
    def update_availability(self, request, pk=None):
        worker = self.get_object()
        is_available = request.data.get('is_available')
        
        worker.is_available = is_available
        worker.save()
        return Response({'message': 'Availability updated successfully'})

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]  # Only admin can manage users

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'WORKER':
            return Notification.objects.filter(worker__user=user)
        return Notification.objects.none()  # Only workers get notifications

# Custom API Views
class DashboardStats(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        from django.utils import timezone
        from datetime import timedelta
        
        total_users = CustomUser.objects.count()
        total_complaints = Complaint.objects.count()
        resolved_complaints = Complaint.objects.filter(status='RESOLVED').count()
        pending_complaints = Complaint.objects.filter(status='PENDING').count()
        
        # Recent complaints (last 7 days)
        week_ago = timezone.now() - timedelta(days=7)
        recent_complaints = Complaint.objects.filter(created_at__gte=week_ago).count()
        
        stats = {
            'total_users': total_users,
            'total_complaints': total_complaints,
            'resolved_complaints': resolved_complaints,
            'pending_complaints': pending_complaints,
            'recent_complaints': recent_complaints,
            'resolution_rate': (resolved_complaints / total_complaints * 100) if total_complaints > 0 else 0
        }
        return Response(stats)

class AssignComplaint(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request, pk):
        try:
            complaint = Complaint.objects.get(id=pk)
            worker_id = request.data.get('worker_id')
            worker = Worker.objects.get(id=worker_id)
            
            if not worker.is_available:
                return Response({'error': 'Worker is not available'}, status=status.HTTP_400_BAD_REQUEST)
            
            complaint.assigned_worker = worker
            complaint.status = 'ASSIGNED'
            complaint.assigned_at = timezone.now()
            complaint.save()
            
            return Response({'message': 'Complaint assigned successfully'})
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)
        except Worker.DoesNotExist:
            return Response({'error': 'Worker not found'}, status=status.HTTP_404_NOT_FOUND)

class UpdateComplaintStatus(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            complaint = Complaint.objects.get(id=pk)
            new_status = request.data.get('status')
            
            # Authorization check
            if request.user.role == 'WORKER' and complaint.assigned_worker.user != request.user:
                return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            if request.user.role == 'USER' and complaint.user != request.user:
                return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
            if new_status in dict(Complaint.STATUS_CHOICES):
                complaint.status = new_status
                if new_status == 'RESOLVED':
                    complaint.resolved_at = timezone.now()
                complaint.save()
                return Response({'message': 'Status updated successfully'})
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

class UpdateWorkerAvailability(APIView):
    permission_classes = [IsAdminOrWorker]
    
    def post(self, request, pk):
        try:
            worker = Worker.objects.get(id=pk)
            # Workers can only update their own availability
            if request.user.role == 'WORKER' and worker.user != request.user:
                return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
            is_available = request.data.get('is_available')
            worker.is_available = is_available
            worker.save()
            return Response({'message': 'Availability updated successfully'})
        except Worker.DoesNotExist:
            return Response({'error': 'Worker not found'}, status=status.HTTP_404_NOT_FOUND)

class AvailableWorkers(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        workers = Worker.objects.filter(is_available=True)
        serializer = WorkerSerializer(workers, many=True)
        return Response(serializer.data)

class ValidateComplaintAI(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            complaint = Complaint.objects.get(id=pk)
            # Simple AI validation simulation
            description = complaint.description
            
            # Basic validation logic (you'll replace this with actual AI)
            is_valid = len(description) >= 10  # Minimum length
            score = min(len(description) / 100, 1.0)  # Simple scoring
            
            complaint.is_ai_validated = is_valid
            complaint.ai_validation_score = score
            complaint.ai_feedback = "Description meets basic requirements" if is_valid else "Description too short"
            complaint.validated_description = description  # In real app, this would be corrected version
            complaint.save()
            
            return Response({
                'is_valid': is_valid,
                'score': float(score),
                'feedback': complaint.ai_feedback
            })
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

class UserComplaints(APIView):
    permission_classes = [IsRegularUser]
    
    def get(self, request):
        complaints = Complaint.objects.filter(user=request.user)
        serializer = ComplaintSerializer(complaints, many=True)
        return Response(serializer.data)

class UserNotifications(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if request.user.role == 'WORKER':
            notifications = Notification.objects.filter(worker__user=request.user)
            serializer = NotificationSerializer(notifications, many=True)
            return Response(serializer.data)
        return Response([])  # Only workers have notifications

class WorkerComplaints(APIView):
    permission_classes = [IsWorkerUser]
    
    def get(self, request):
        complaints = Complaint.objects.filter(assigned_worker__user=request.user)
        serializer = ComplaintSerializer(complaints, many=True)
        return Response(serializer.data)

class AutoAssignComplaint(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request, pk):
        try:
            complaint = Complaint.objects.get(id=pk)
            # Simple auto-assignment logic (nearest available worker)
            available_workers = Worker.objects.filter(is_available=True)
            
            if available_workers.exists():
                # For now, assign to first available worker
                # In real app, implement distance calculation
                worker = available_workers.first()
                complaint.assigned_worker = worker
                complaint.status = 'ASSIGNED'
                complaint.assigned_at = timezone.now()
                complaint.save()
                
                # Create notification
                Notification.objects.create(
                    worker=worker,
                    complaint=complaint,
                    message=f"New complaint auto-assigned to you: {complaint.get_category_display()}"
                )
                
                return Response({
                    'message': 'Complaint auto-assigned successfully',
                    'assigned_worker': WorkerSerializer(worker).data
                })
            return Response({'error': 'No available workers'}, status=status.HTTP_400_BAD_REQUEST)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)