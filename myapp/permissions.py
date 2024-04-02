from rest_framework.permissions import BasePermission

class IsCitoyenPermission(BasePermission):
    """
    Custom permission to only allow access to Citoyen users.
    """
    def has_permission(self, request, view):
        # Check if the requesting user is authenticated and a Citoyen
        return request.user.is_authenticated and request.user.is_citoyen
