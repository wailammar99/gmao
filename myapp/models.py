
from django.db import models
from django import forms
from django.contrib.auth.models import AbstractUser, Group,User
from datetime import *
from django.utils.timezone import *
class service (models.Model):
    nom=models.CharField(max_length=150)
    descrtions=models.TextField(max_length=3000)

class CustomUser(AbstractUser):
    is_admin= models.BooleanField('Is admin', default=False)
    is_technicien = models.BooleanField('is technicien', default=False)
    is_chefservice = models.BooleanField('Is chef service', default=False)
    is_directeur = models.BooleanField('directeur', default=False)
    is_citoyen=  models.BooleanField('citoyen', default=False)
    service = models.ForeignKey('service', null=True, blank=True,on_delete=models.CASCADE)
    
class interven(models.Model):
    description = models.TextField(max_length=2048)
    date_creation = models.DateField(default=date.today)
    date_debut = models.DateField(null=True, blank=True)
    date_fin = models.DateField(null=True, blank=True)
    citoyen = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    technicien = models.IntegerField(null=True, blank=True)
    service=models.ForeignKey('service',on_delete=models.CASCADE)
    
    # Define choices for the state
    ETAT_CHOICES = (
        ('Nouveau', 'Nouveau'),
        ('En attente', 'En attente'),
        ('En cours', 'En cours'),
        ('Assigné', 'Assigné'),

        ('Terminé', 'Terminé'),
        ('Annulé', 'Annulé'),
        
    )
    etat = models.CharField(max_length=200, choices=ETAT_CHOICES, default='Nouveau')

    def save(self, *args, **kwargs):
        # If the intervention is new (i.e., it doesn't have a primary key yet),
        # set its state to "Nouveau"
        if not self.pk:
            self.etat = 'Nouveau'
        super().save(*args, **kwargs)





    

    
    
        





        
    # Create your models here.
