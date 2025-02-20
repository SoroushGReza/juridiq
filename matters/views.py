import logging
from rest_framework import generics, permissions
from .models import Matter
from .serializers import MatterCreateUpdateSerializer

logger = logging.getLogger(__name__)


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Id user is super superuser / admin
        if request.user.is_staff or request.user.is_superuser:
            logger.debug("User %s is admin or superuser", request.user)
            return True
        # If user is delegated admin & exist in matter object delegated_admins
        if getattr(request.user, "is_delegated_admin", False):
            if request.user in obj.delegated_admins.all():
                logger.debug(
                    "User %s is delegated admin for matter %s", request.user, obj.id
                )
                return True
        # If user is matter owner (regular user)
        result = obj.user == request.user
        logger.debug(
            "User %s is matter owner for matter %s: %s", request.user, obj.id, result
        )
        return result


class MatterListCreateView(generics.ListCreateAPIView):
    """
    GET: List all Matters (owned by logged in user or ALL id admin)
    POST: Create a new Matter + upload files in same request
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MatterCreateUpdateSerializer

    def get_queryset(self):
        user = self.request.user
        logger.info("MatterListCreateView.get_queryset called by user: %s", user)
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
        status_param = self.request.query_params.get("status")
        if status_param:
            logger.debug("Filtering matters by status: %s", status_param)
            queryset = queryset.filter(status=status_param)
        qs = queryset.distinct()
        logger.info(
            "MatterListCreateView.get_queryset returning %d objects", qs.count()
        )
        return qs


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
        logger.info(
            "MatterRetrieveUpdateDestroyView.get_queryset called by user: %s", user
        )
        if user.is_staff or user.is_superuser:
            queryset = Matter.objects.all()
        elif getattr(user, "is_delegated_admin", False):
            # Include matetrs where user id owner or delegated admin
            queryset = Matter.objects.filter(user=user) | Matter.objects.filter(
                delegated_admins=user
            )
        else:
            queryset = Matter.objects.filter(user=user)
        qs = queryset.distinct()
        logger.info(
            "MatterRetrieveUpdateDestroyView.get_queryset returning %d objects",
            qs.count(),
        )
        return qs

    def perform_destroy(self, instance):
        logger.info(
            "MatterRetrieveUpdateDestroyView.perform_destroy called for matter id: %s",
            instance.id,
        )
        instance.delete()  # Removes matter + files (on_delete=CASCADE)
        logger.info("Matter id %s deleted", instance.id)
