
from django.db import models
from django import forms
from django.contrib.auth.models import AbstractUser, Group,User

class CustomUser(AbstractUser):
    is_admin= models.BooleanField('Is admin', default=True)
    is_technicien = models.BooleanField('is technicien', default=False)
    is_chefservice = models.BooleanField('Is chef service', default=False)
    is_directeur = models.BooleanField('directeur', default=False)
    is_citoyen=  models.BooleanField('citoyen', default=False)



    
        





        
    # Create your models here.
