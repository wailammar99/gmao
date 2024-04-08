
from django.db import models
from django import forms
from django.contrib.auth.models import AbstractUser, Group,User
from datetime import *
from django.utils.timezone import *

class service (models.Model):
    nom=models.CharField(max_length=150)
    descrtions=models.TextField(max_length=3000)
    def __str__(self):
        return self.nom

class enatte (models.Model):
    description=models.TextField()
    date_de_creation=models.DateField(default=date.today())


class Equipement(models.Model):
    nom = models.CharField(max_length=100)
    marque = models.CharField(max_length=100)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    stock = models.PositiveIntegerField(default=0)
    date_ajout = models.DateField(auto_now_add=True)
    statut = models.BooleanField(default=True)
    numero_serie = models.CharField(max_length=100, blank=True)
    date_expiration = models.DateField(blank=True, null=True)
    caracteristiques_techniques = models.TextField(blank=True)

    def __str__(self):
        return self.nom


class CustomUser(AbstractUser):
    is_admin= models.BooleanField('Is admin', default=False)
    is_technicien = models.BooleanField('is technicien', default=False)
    is_chefservice = models.BooleanField('Is chef service', default=False)
    is_directeur = models.BooleanField('directeur', default=False)
    is_citoyen=  models.BooleanField('citoyen', default=False)
    service = models.ForeignKey('service', null=True, blank=True,on_delete=models.CASCADE)
    def __str__(self):
        return self.username

   
class converstation(models.Model):
   
    title = models.CharField(max_length=100)
    participants = models.ManyToManyField(CustomUser, related_name='conversations')
    
class interven(models.Model):
    description = models.TextField(max_length=2048)
    date_creation = models.DateField(default=date.today)
    date_debut = models.DateField(null=True, blank=True)
    date_fin = models.DateField(null=True, blank=True)
    citoyen = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    technicien = models.IntegerField(null=True, blank=True)
    service=models.ForeignKey('service',on_delete=models.CASCADE)
    equipements = models.ManyToManyField(Equipement, blank=True)
    raison=models.ForeignKey(enatte,on_delete=models.CASCADE,null=True ,blank=True)
    conversation = models.ForeignKey(converstation, on_delete=models.CASCADE, null=True, blank=True)

    # Define choices for the state
    ETAT_CHOICES = (
        ('Nouveau', 'Nouveau'),
        ('En attente', 'En attente'),
        ('En cours', 'En cours'),
        ('Assigné', 'Assigné'),

        ('Terminé', 'Terminé'),
        ('Annulé', 'Annulé'),   
        ('Clôture','Clôture'),
        
    )
    etat = models.CharField(max_length=200, choices=ETAT_CHOICES, default='Nouveau')
    # con=models.ForeignKey(converstation,on_delete=models.CASCADE,null=True ,blank=True)
    
    def save(self, *args, **kwargs):
        # If the intervention is new (i.e., it doesn't have a primary key yet),
        # set its state to "Nouveau"
        if not self.pk:
            self.etat = 'Nouveau'
        super().save(*args, **kwargs)
    def __str__(self):
     if self.description:
        return self.description
     else:
        return f"Interven {self.id}"

class message (models.Model):
    converstation=models.ForeignKey(converstation,on_delete=models.CASCADE,null=True ,blank=True)
    contenu=models.TextField()
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    horodatage=models.DateTimeField(auto_now_add=True)
    MESSAGE_TYPES = (
        ('private', 'Message privé'),
        ('public', 'Message public'),
    )
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default='private')
    def __str__(self):
        return f"Message in {self.converstation}"
    
class Notification(models.Model):
 recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
 message = models.CharField(max_length=255)
 is_read = models.BooleanField(default=False)
 created_at = models.DateTimeField(auto_now_add=True)

    
    
        





        
    # Create your models here.
