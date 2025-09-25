# complaint_system/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, Worker, Complaint, Notification

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 'phone_number', 'address', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        role = validated_data.pop('role')
        
        user = CustomUser.objects.create_user(**validated_data, role=role)
        user.set_password(password)
        user.save()
        
        # If user is worker, create worker profile
        if role == 'WORKER':
            Worker.objects.create(user=user)
        
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('Account disabled')
            
            attrs['user'] = user
            return attrs
        raise serializers.ValidationError('Must include username and password')

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'phone_number', 'address', 'role', 'date_joined')

class WorkerSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Worker
        fields = ['id', 'user', 'is_available', 'current_location', 
                 'latitude', 'longitude', 'active_complaint_count']
class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = [
            "id",
            "user",
            "category",
            "description",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "user", "status", "created_at"]

class NotificationSerializer(serializers.ModelSerializer):
    worker = WorkerSerializer(read_only=True)
    complaint = ComplaintSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'worker', 'complaint', 'message', 'is_read', 'created_at']