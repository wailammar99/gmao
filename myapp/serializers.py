from .models import *
from rest_framework import serializers
class ServiceSerializers(serializers.ModelSerializer):
    class Meta:
        model=service
        fields='__all__'
class CustomeUserSerializers(serializers.ModelSerializer):
    service=ServiceSerializers()
    class Meta:
        model = CustomUser
        fields = '__all__'
class IntervetionSerializers(serializers.ModelSerializer):
    citoyen = CustomeUserSerializers()
    class Meta :
        model=interven
        fields='__all__'
