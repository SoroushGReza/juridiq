from rest_framework import generics, permissions
from .models import Matter
from .serializers import MatterCreateUpdateSerializer


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_superuser:
            return True
        return (getattr(obj, "user", None) == request.user) or (
            hasattr(obj, "matter") and obj.matter.user == request.user
        )


class MatterListCreateView(generics.ListCreateAPIView):
    """
    GET: List all Matters (owned by logged in user or ALL id admin)
    POST: Create a new Matter + upload files in same request
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MatterCreateUpdateSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            queryset = Matter.objects.all()
        else:
            queryset = Matter.objects.filter(user=user)

        # Filter by status
        status = self.request.query_params.get("status")
        if status:
            queryset = queryset.filter(status=status)

        return queryset


class MatterRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a single Matter
    PUT/PATCH: Update Matter + add/remove files in a single request
    DELETE: Delete Matter (including all files)
    """

    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = MatterCreateUpdateSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Matter.objects.all()
        return Matter.objects.filter(user=user)

    def perform_destroy(self, instance):
        instance.delete()  # Removes matter + files (on_delete=CASCADE)
