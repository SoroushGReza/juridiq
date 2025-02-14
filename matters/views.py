from rest_framework import generics, permissions
from .models import Matter
from .serializers import MatterCreateUpdateSerializer


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Id user is super superuser / admin
        if request.user.is_staff or request.user.is_superuser:
            return True
        # If user is delegated admin & exist in matter object delegated_admins
        if getattr(request.user, "is_delegated_admin", False):
            if request.user in obj.delegated_admins.all():
                return True
        # If user is matter owner (regular user)
        return obj.user == request.user


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
        elif getattr(user, "is_delegated_admin", False):
            # Include matters that user own and/or is assigned to as deligated admin
            queryset = Matter.objects.filter(user=user) | Matter.objects.filter(
                delegated_admins=user
            )
        else:
            queryset = Matter.objects.filter(user=user)

        # Filter by status
        status = self.request.query_params.get("status")
        if status:
            queryset = queryset.filter(status=status)
        return queryset.distinct()


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
            queryset = Matter.objects.all()
        elif getattr(user, "is_delegated_admin", False):
            # Include matetrs where user id owner or delegated admin
            queryset = Matter.objects.filter(user=user) | Matter.objects.filter(
                delegated_admins=user
            )
        else:
            queryset = Matter.objects.filter(user=user)
        return queryset.distinct()

    def perform_destroy(self, instance):
        instance.delete()  # Removes matter + files (on_delete=CASCADE)
