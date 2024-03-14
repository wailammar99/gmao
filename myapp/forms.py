from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import *

class LoginForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={"class": "form-control"}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={"class": "form-control"}))

class SignUpForm(UserCreationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={"class": "form-control"}))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={"class": "form-control"}))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={"class": "form-control"}))
    email = forms.CharField(widget=forms.TextInput(attrs={"class": "form-control"}))
    first_name = forms.CharField(widget=forms.TextInput(attrs={"class": "form-control"}))  # Add first name field
    last_name = forms.CharField(widget=forms.TextInput(attrs={"class": "form-control"}))   # Add last name field
    is_active = forms.BooleanField(required=False, initial=False, widget=forms.HiddenInput())
    
    class Meta:
        model = CustomUser
        fields = ('username', 'first_name','last_name','email', 'password1', 'password2', 'is_admin', 'is_technicien', 'is_chefservice', 'is_directeur', 'is_citoyen')
        
    def save(self, commit=True):
        user = super().save(commit=False)
        if user.is_admin:
            user.is_active = True
        else:
            user.is_active = False
            # Query the Service model to get the desired service instance
            service_instance = service.objects.get(nom="noservice")  # Adjust this query according to your needs
            user.service = service_instance
        if commit:
            user.save()
        return user
class IntervenForm(forms.ModelForm):
    class Meta:
        model = interven
        fields = ['description', 'date_creation']   

class formservice(forms.ModelForm):
    class Meta :
        model=service
        fields=["descrtions",'nom'] 
class EnatteForm(forms.ModelForm):
    class Meta:
        model = enatte
        date=forms.DateField(initial=date.today)
        fields = ['description', 'date_de_creation']

