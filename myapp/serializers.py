from .models import *
from rest_framework import serializers
class enattenSerializers(serializers.ModelSerializer):
    class Meta :
        model=enatte
        fields="__all__"
class ServiceSerializers(serializers.ModelSerializer):
    class Meta:
        model=service
        fields='__all__'
class CustomeUserSerializers(serializers.ModelSerializer):
    service = ServiceSerializers()
    class Meta:
        model = CustomUser
        fields = '__all__'
class IntervetionSerializers(serializers.ModelSerializer):
    citoyen = CustomeUserSerializers()
    service = ServiceSerializers()
    raison=enattenSerializers()
    class Meta :
        model=interven
        fields='__all__'
class EquimenentSerializers(serializers.ModelSerializer):

    class Meta :
        model=Equipement
        fields='__all__'
class ConversationSerializers(serializers.ModelSerializer):
    user=CustomeUserSerializers()
    class Meta:
        model=converstation
        fields="_all_"

