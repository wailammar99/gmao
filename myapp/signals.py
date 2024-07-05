# myapp/signals.py

from django.db.models.signals import *
from django.dispatch import receiver
from .models import *
#singal whhen create a converstaion notif the pertisepent 
@receiver(m2m_changed, sender=converstation.participants.through)
def send_notification_to_participants(sender, instance, action, **kwargs):
    if action == "post_add":
        print("Signal received: Participants added to conversation")
        for participant in instance.participants.all():
            print(f"Creating notification for participant: {participant.id}")
            Notification.objects.create(
                message="Une nouvelle conversation est créée",
                is_read=False,
                recipient=participant
            )
#create notification when the messge is send ()
@receiver(post_save,sender=message)
def send_ntofication_message(sender,instance,created,**kwargs):
    if created:
        print("triggger the signal of ntoofictaion mesage ")
        Conver=instance.converstation
        for p in Conver.participants.all():
             if p!=instance.sender:
                Notification.objects.create(
                message="vous avez nouveux message de  "+instance.sender.username,
                is_read=False,
                recipient=p
            )

