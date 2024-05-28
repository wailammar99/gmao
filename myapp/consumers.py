import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from channels.db import *
from .models import *
from asgiref.sync import async_to_sync

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
