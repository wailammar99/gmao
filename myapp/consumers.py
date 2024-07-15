import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from channels.db import *
from .models import *
import logging
from asgiref.sync import async_to_sync
from asgiref.sync import sync_to_async

class ConversationChat(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = f"room_{self.scope['url_route']['kwargs']['conversation_id']}"
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_data = text_data_json

        # Create the message
        new_message = await self.create_message(data=message_data)

        # Prepare the response data
        response_data = {
            'horodatage': new_message.horodatage.strftime('%Y-%m-%d %H:%M:%S'),
            'type': new_message.message_type,
            'contenu': new_message.contenu,
            'sender': {
                'username': new_message.sender.username
            }
        }

        # Send the message to the group
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'broadcast_message',
                'message': response_data
            }
        )

    async def broadcast_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))

    @database_sync_to_async
    def create_message(self, data):
        room = converstation.objects.get(id=self.scope['url_route']['kwargs']['conversation_id'])
        user = CustomUser.objects.get(id=data['sender'])
        new_message = message(converstation=room, sender=user, contenu=data['message'], message_type=data["type"])
        new_message.save()
        return new_message


class MessageCustomer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = f"room_{self.scope['url_route']['kwargs']['conversation_id']}"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_data = text_data_json

        # Create the message
        new_message = await self.create_message(data=message_data)

        # Prepare the response data
        response_data = {
            'horodatage': new_message.horodatage.strftime('%Y-%m-%d %H:%M:%S'),
            'type': new_message.message_type,
            'contenu': new_message.contenu,
            'sender': {
                'username': new_message.sender.username
            }
        }

        # Send the message to the group
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'broadcast_message',
                'message': response_data
            }
        )

    async def broadcast_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({'message': message}))

    @database_sync_to_async
    def create_message(self, data):
        room = converstation.objects.get(id=self.scope['url_route']['kwargs']['conversation_id'])
        user = CustomUser.objects.get(id=data['sender'])
        contenu = data.get('contenu') 
        if not message.objects.filter(contenu=contenu).exists():
            new_message = message(converstation=room, sender=user, contenu=data['message'], message_type=data["type"])
            new_message.save()
            return new_message

    @staticmethod
    @database_sync_to_async
    def broadcast_message(conversation_id, message):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"room_{conversation_id}",
            {
                "type": "broadcast_message",
                "message": message,
            }
        )
        #to delete if we have probleme 
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'notifications_{self.user_id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        notification_id = data['notification_id']

        notification = await self.get_notification(notification_id)

        await self.send(text_data=json.dumps({
            'id': notification.id,
            'message': notification.message,
            'is_read': notification.is_read,
            'created_at': str(notification.created_at),
        }))

    @sync_to_async
    def get_notification(self, notification_id):
        return Notification.objects.get(id=notification_id)

    async def send_notification(self, event):
        notification = event['notification']

        await self.send(text_data=json.dumps(notification))



class InterventionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'interventions_{self.user_id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        interventions = await self.get_all_interventions()
        await self.send(text_data=json.dumps({
            'interventions': interventions
        }, default=str))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        intervention_id = data.get('intervention_id')

        if intervention_id:
            intervention = await self.get_intervention(intervention_id)

            await self.send(text_data=json.dumps({
                'id': intervention.id,
                'description': intervention.description,
                'date_creation': str(intervention.date_creation),
                'date_debut': str(intervention.date_debut) if intervention.date_debut else None,
                'date_fin': str(intervention.date_fin) if intervention.date_fin else None,
                'latitude': str(intervention.latitude) if intervention.latitude else None,
                'longitude': str(intervention.longitude) if intervention.longitude else None,
            }, default=str))

    @sync_to_async
    def get_intervention(self, intervention_id):
        return interven.objects.get(id=intervention_id)

    @database_sync_to_async
    def get_all_interventions(self):
        user = CustomUser.objects.get(id=self.user_id)
        if user.is_citoyen:
            interventions = interven.objects.filter(citoyen=user).values()
        elif user.is_chefservice:
            interventions = interven.objects.filter(service=user.service).values()
        elif user.is_directeur:
            interventions = interven.objects.all().values()
        elif user.is_technicien:
            interventions = interven.objects.filter(technicien=user.id).values()

        for intervention in interventions:
            intervention['date_creation'] = intervention['date_creation'].isoformat()
            if intervention['date_debut']:
                intervention['date_debut'] = intervention['date_debut'].isoformat()
            if intervention['date_fin']:
                intervention['date_fin'] = intervention['date_fin'].isoformat()
            if intervention['latitude']:
                intervention['latitude'] = str(intervention['latitude'])
            if intervention['longitude']:
                intervention['longitude'] = str(intervention['longitude'])

        return list(interventions)

    async def send_intervention_notification(self, event):
        intervention = event['intervention']
        logging.info(f"Received notification event: {event}")
        await self.send(text_data=json.dumps(intervention, default=str))

    async def delete_intervention_notification(self, event):
        intervention_id = event['intervention_id']
        logging.info(f"Received delete notification event: {event}")
        await self.send(text_data=json.dumps({'id': intervention_id, 'deleted': True}))