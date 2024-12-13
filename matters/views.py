from rest_framework import generics, permissions
from .models import Matter
from .serializers import MatterSerializer, MatterDetailSerializer


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_superuser:
            return True
        return obj.user == request.user


class MatterListCreateView(generics.ListCreateAPIView):
    serializer_class = MatterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Matter.objects.all()
        return Matter.objects.filter(user=self.request.user)


class MatterRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Matter.objects.all()
        return Matter.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method in permissions.SAFE_METHODS:
            return MatterSerializer
        else:
            return MatterDetailSerializer

    def perform_update(self, serializer):
        serializer.save()
