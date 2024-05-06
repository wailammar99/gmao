import json
from channels.generic.websocket import WebsocketConsumer
from .models import Notification
class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data):
        # You can implement custom logic here to handle received data
        pass

    def send_notification(self, event):
        notification = event['notification']
        # Send notification data to the client
        self.send(text_data=json.dumps(notification))