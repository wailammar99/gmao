

from django.db import models
from django import forms









class Item(models.Model):
    
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class formitems (forms.ModelForm):
    class Meta :
        model=Item
        fields=['name','description']
class ing (models.Model):
    nom=models.CharField(max_length=200)
    
    prenom=models.CharField(max_length=200)
    phone=models.CharField(max_length=200)
    adresse=models.CharField(max_length=200)
    mail=models.EmailField(max_length=200,unique=True)
    u=models.CharField(max_length=200,unique=True)
   
    def __str__(self):
     return  self.mail
class gestionmaitenace (models.Model):
    intervention=models.IntegerField(max_length=200)
    date_intervention=models.DateField()
    dure=models.IntegerField(max_length=200)
    engineer = models.ForeignKey(ing, on_delete=models.CASCADE, related_name='maintenances')
   

class worker (models.Model):
    nom=models.CharField(max_length=200,null=True, blank=True)
    prenom=models.CharField(max_length=200,null=True, blank=True)
    u=models.CharField(max_length=200,unique=True,null=True, blank=True)
   
    phone=models.CharField(max_length=200,null=True, blank=True)
    adresse=models.CharField(max_length=200,null=True, blank=True)
    email=models.EmailField(max_length=200,unique=True,null=True, blank=True)
    
    def __str__(self):
     return  self.nom    
# class UserManager(BaseUserManager):
#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError('The Email field must be set')
#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password=None, **extra_fields):
#         extra_fields.setdefault('is_admin', True)
#         extra_fields.setdefault('is_cos', False)
#         extra_fields.setdefault('is_employe', False)

#         if extra_fields.get('is_admin') is not True:
#             raise ValueError('Superuser must have is_admin=True.')
#         return self.create_user(email, password, **extra_fields)

#  class User(AbstractBaseUser):
#      email = models.EmailField(unique=True)
   
#     is_admin = models.BooleanField("is_admin", default=True)
  

#     is_cos = models.BooleanField("is customer", default=False)
#    is_employe = models.BooleanField("is employer", default=False)



    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email
    


   
    





    
# Create your models here.
