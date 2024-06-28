
from django.db import models
from django import forms
from django.contrib.auth.models import AbstractUser, Group,User
from datetime import *
from django.http import FileResponse
from django.utils.timezone import *
from django.utils import timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from django.http import HttpResponse

class service (models.Model):
    nom=models.CharField(max_length=150)
    descrtions=models.TextField(max_length=3000)
    def __str__(self):
        return self.nom

class enatte (models.Model):
    description=models.TextField()
    date_de_creation=models.DateField(default=timezone.now)


class Equipement(models.Model):
    service=models.ForeignKey('service',on_delete=models.CASCADE,blank=True, null=True)
 
    nom = models.CharField(max_length=100,null=True)
    marque = models.CharField(max_length=100,null=True)
    prix = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
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
    telephone = models.CharField(max_length=20,blank=True,null=True)

    date_de_naissance=models.DateField(blank=True,null=True)
    adresse=models.CharField(max_length=500,blank=True,null=True)
    
    def __str__(self):
        return self.username

   
class converstation(models.Model):
   
    title = models.CharField(max_length=100)
    participants = models.ManyToManyField(CustomUser, related_name='conversations')
    def add_participant(self, user):
        """
        Ajoute un utilisateur à la conversation.
        """
        self.participants.add(user)
    def test_particepemnt(self,user):
        return self.participants.filter(pk=user.pk).exists()
class interven(models.Model):
    description = models.TextField(max_length=2048)
    date_creation = models.DateField(default=date.today)
    date_debut = models.DateField(null=True, blank=True)
    date_fin = models.DateField(null=True, blank=True)
    citoyen = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True,blank=True)
    technicien = models.IntegerField(null=True, blank=True)
    service=models.ForeignKey('service',on_delete=models.CASCADE,null=True,blank=True)
    equipements = models.ManyToManyField(Equipement, blank=True)
    raison=models.ForeignKey(enatte,on_delete=models.CASCADE,null=True ,blank=True)
    adresse=models.CharField("adresse ",blank=True,null=True,max_length=500)
    titre=models.CharField("titre",blank=True,null=True,max_length=50)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
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

class Contact (models.Model):
    email=models.EmailField(max_length=100)
    nom=models.CharField(max_length=100)
    telephone=models.IntegerField()
    SUJET_TYPE = (
        ('probleme avec compte ', 'probleme avec compte '),
        ('publicite', 'publicite '),
        ('suggestion','sugestion'),
        ("autre","auttre"),
        ("abonement","abonement")
    )
    sujet_type = models.CharField(max_length=1100, choices=SUJET_TYPE, default='autre')
    message=models.TextField(max_length=2500)
class Rapport(models.Model):
    date_rapport = models.DateField(auto_now_add=True)
    date_debut = models.DateField(null=True, blank=True)
    date_fin = models.DateField(null=True, blank=True)
    interventions = models.ManyToManyField(interven)

    def generate_rapport(self):
        interventions = interven.objects.filter(date_debut__range=[self.date_debut, self.date_fin],date_fin__range=[self.date_debut, self.date_fin])
        
        return interventions

    def generate_pdf(self):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="rapport.pdf"'

        doc = SimpleDocTemplate(response, pagesize=letter)
        data = []
        

        # Add header row
        header = ['Date début', 'Date fin',"Etat", 'Technicien', 'Service', 'Citoyen','chefservice']
        data.append(header)
        
        # Add data rows
        for intervention in self.interventions.all().select_related("service").select_related("citoyen"):
            tech = CustomUser.objects.get(id=intervention.technicien) if intervention.technicien else None
            chf = CustomUser.objects.filter(service=intervention.service, is_chefservice=True).first()
            row = [
                            intervention.date_debut,
                            intervention.date_fin,
                           
                            intervention.etat,
                            tech.email if tech.email else "",  # Accessing technicien
                            intervention.service.nom if intervention.service else "",  # Accessing service name
                            intervention.citoyen.email if intervention.citoyen else "",
                            chf.email if chf.email else "",
                               
                            
                            
                
               
                
                
                
                
                
            ]
            data.append(row)
       
        # Create table and style
        table = Table(data)
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ])

        # Apply style
        table.setStyle(style)

        # Build PDF
        doc.build([table])

        return response

        




        
    # Create your models here.
