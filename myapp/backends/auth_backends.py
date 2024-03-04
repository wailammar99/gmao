from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from ..models import CustomUser

CustomUser= get_user_model()

class CustomRoleBackend(ModelBackend):
    """
    Custom authentication backend to authenticate users based on their role.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        # Your custom authentication logic goes here
        user = CustomUser.objects.filter(username=username).first()
        if user and user.check_password(password):
            # Check the role and return the user accordingly
            if user.is_admin:
                return user
            elif user.is_technicien:
                return user
            elif user.is_chefservice:
                return user
            elif user.is_directeur:
                return user
            elif user.is_citoyen:
             return user
            # Add other roles here
        return None
