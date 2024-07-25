from .models import *
from rest_framework import serializers


class EnterpriseSerialize(serializers.ModelSerializer):
    class Meta :
        model=Enterprise
        fields="__all__"
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
    enterprise=EnterpriseSerialize()
    class Meta:
        model = CustomUser
        fields = '__all__'
class ConversationSerializers(serializers.ModelSerializer):
    participants = CustomeUserSerializers(many=True)
    class Meta:
        model=converstation
        fields="__all__"
class IntervetionSerializers(serializers.ModelSerializer):
    citoyen = CustomeUserSerializers()
    enterprise=EnterpriseSerialize()
    service = ServiceSerializers()
    raison=enattenSerializers()
    conversation=ConversationSerializers()
    class Meta :
        model=interven
        fields='__all__'

class EquimenentSerializers(serializers.ModelSerializer):
    service = ServiceSerializers()
    enterprise=EnterpriseSerialize()
    class Meta :
        model=Equipement
        fields='__all__'

class MessageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = message
        fields = '__all__'

        # You may want to include this line if you want to display the sender's username in the serialized data
        depth = 1
class NotificationSerialize(serializers.ModelSerializer):
    recipient=CustomeUserSerializers()
    class Meta :
     model=Notification
     fields='__all__'
class ContactSerialize(serializers.ModelSerializer):
    class Meta :
        model=Contact
        fields='__all__'
class RapportSerialize(serializers.ModelSerializer):
    interventions = IntervetionSerializers(many=True)
    class Meta :
        model=Rapport
        fields="__all__"
