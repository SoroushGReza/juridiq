from django.urls import path
from .views import MatterListCreateView, MatterRetrieveUpdateDestroyView

urlpatterns = [
    path("", MatterListCreateView.as_view(), name="matter-list-create"),
    path(
        "<int:pk>/",
        MatterRetrieveUpdateDestroyView.as_view(),
        name="matter-detail",
    ),
]
