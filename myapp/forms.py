from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser,interven

class LoginForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={"class": "form-control"}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={"class": "form-control"}))

class SignUpForm(UserCreationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={"class": "form-control"}))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={"class": "form-control"}))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={"class": "form-control"}))
    email = forms.CharField(widget=forms.TextInput(attrs={"class": "form-control"}))
    is_active = forms.BooleanField(required=False, initial=False, widget=forms.HiddenInput())

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2', 'is_admin', 'is_technicien', 'is_chefservice', 'is_directeur','is_citoyen')
    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_active= False  # Set is_stuff to False by default
        if commit:
            user.save()
        return user
class IntervenForm(forms.ModelForm):
    class Meta:
        model = interven
        fields = ['description', 'date_creation', 'date_debut', 'date_fin']   
