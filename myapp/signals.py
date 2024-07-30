# myapp/signals.py

from django.db.models.signals import *
from django.dispatch import receiver
from .models import *
from asgiref.sync import async_to_sync
from .serializers import *
from channels.layers import *
import logging
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

logger = logging.getLogger(__name__)

@receiver(pre_save, sender=interven)
def track_field_changes(sender, instance, **kwargs):
    if instance.pk:
        previous = interven.objects.get(pk=instance.pk)
        instance._previous_service = previous.service
        instance._previous_technicien = previous.technicien
    else:
        instance._previous_service = None
        instance._previous_technicien = None

@receiver(pre_save, sender=interven)
def track_field_changes(sender, instance, **kwargs):
    if instance.pk:
        previous = interven.objects.get(pk=instance.pk)
        instance._previous_fields = {
            field.name: getattr(previous, field.name) for field in instance._meta.get_fields()
            if field.concrete and field.name not in ['id']  # Exclude the primary key
        }
    else:
        instance._previous_fields = {}

@receiver(post_save, sender=interven)
def socket_intervention(sender, instance, created, **kwargs):
    try:
        channel_layer = get_channel_layer()
        serializer = IntervetionSerializers(instance)
        users_to_notify = []

        # Fetching chefservice and directeur separately
        chefservice = CustomUser.objects.filter(service=instance.service, is_chefservice=True).first()
        directeur = CustomUser.objects.filter(is_directeur=True).first()
        print(f'dicrceteur is {directeur.id} and chef service is {chefservice.id}')

        if created:
            print("New intervention created") 
        else:
            print("Intervention updated")

        # Notify relevant users
        users_to_notify.append(f'interventions_{instance.citoyen.id}')
        users_to_notify.append(f'interventions_{directeur.id}')
        if instance.technicien:
            users_to_notify.append(f'interventions_{instance.technicien}')
        if chefservice:
            users_to_notify.append(f'interventions_{chefservice.id}')
        
            

        for user_group in users_to_notify:
            logger.info(f"Sending notification to group {user_group}")
            async_to_sync(channel_layer.group_send)(
                user_group, {
                    'type': 'send_intervention_notification',
                    'intervention': serializer.data
                }
            )
            logger.info(f"Notification sent to group {user_group}")
    except Exception as e:
        logger.error(f"Error in socket_intervention: {e}")

@receiver(post_delete, sender=interven)
def socket_intervention_delete(sender, instance, **kwargs):
    try:
        channel_layer = get_channel_layer()
        users_to_notify = []

        # Fetching chefservice and directeur separately
        chefservice = CustomUser.objects.get(service=instance.service, is_chefservice=True)
        directeur = CustomUser.objects.get(is_directeur=True)
        print(f"directeur is {directeur.id} and chef service is {chefservice}")

        # Notify relevant users
        users_to_notify.append(f'interventions_{instance.citoyen.id}')
        if instance.technicien:
            users_to_notify.append(f'interventions_{instance.technicien}')
        if chefservice:
            users_to_notify.append(f'interventions_{chefservice.id}')
        if directeur:
            users_to_notify.append(f'interventions_{directeur.id}')

        for user_group in users_to_notify:
            logger.info(f"Sending delete notification to group {user_group}")
            async_to_sync(channel_layer.group_send)(
                user_group, {
                    'type': 'delete_intervention_notification',
                    'intervention_id': instance.id
                }
            )
            logger.info(f"Delete notification sent to group {user_group}")
    except Exception as e:
        logger.error(f"Error in socket_intervention_delete: {e}")
#solution when we delete data from datbasse but still get data from chashe redis 
""" @receiver(post_delete, sender=interven)
def invalidate_cache_on_delete(sender, instance, **kwargs):
    cache_key = 'interven_list'
    cache.delete(cache_key)

@receiver(post_save, sender=interven)
def update_cache_on_save(sender, instance, **kwargs):
    cache_key = 'interven_list'
    interventions = list(Interven.objects.all())
    cache.set(cache_key, interventions) """