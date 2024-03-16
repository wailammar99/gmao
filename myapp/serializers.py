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
class ConversationSerializers(serializers.ModelSerializer):
    user=CustomeUserSerializers()
    class Meta:
        model=converstation
        fields="__all__"
class IntervetionSerializers(serializers.ModelSerializer):
    citoyen = CustomeUserSerializers()
    service = ServiceSerializers()
    raison=enattenSerializers()
    conversation=ConversationSerializers()
    class Meta :
        model=interven
        fields='__all__'

class EquimenentSerializers(serializers.ModelSerializer):

    class Meta :
        model=Equipement
        fields='__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = message
        fields = ['id', 'converstation', 'contenu', 'sender', 'horodatage', 'message_type']

        # You may want to include this line if you want to display the sender's username in the serialized data
        depth = 1
