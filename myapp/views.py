from django.shortcuts import render, redirect
from .forms import SignUpForm, LoginForm,IntervenForm
from django.contrib.auth import authenticate, login,logout
from datetime import *
from django.utils.timezone import *
from .models import CustomUser,interven
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse 

def index(request):
    return render(request, 'index.html')

def register(request):
    msg = None
  
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            COS = form.save()
            msg = 'User created'
            return redirect('login_view')
        else:
            msg = 'Form is not valid'
    else:
        form = SignUpForm()
    return render(request, 'register.html', {'form': form, 'msg': msg})

def login_view(request):
    form = LoginForm(request.POST or None)
    msg = None
    if request.method == 'POST':
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                if user.is_admin:
                    return redirect('admin')
                elif user.is_technicien:
                    return redirect('technicien')
                elif user.is_chefservice:
                    return redirect('chefservice')
                elif user.is_directeur:
                    return redirect('directeur')
                elif user.is_citoyen:
                    return redirect("citoyen")
                else:
                    return redirect('index')  # Redirect to default page
            else:
                msg = 'Invalid username or password'
        else:
            msg = 'Error validating form'
    return render(request, 'login.html', {'form': form, 'msg': msg})

def admin(request):
    if  CustomUser.is_authenticated and CustomUser.is_admin:
     return render(request, 'admin.html')

def technicien(request):
   if  CustomUser.is_authenticated and CustomUser.is_technicien: 
    return render(request, 'technicien.html')

def chefservice(request):
 if  CustomUser.is_authenticated and CustomUser.is_chefservice:
    return render(request, 'chefservice.html')

def directeur(request):
    i=interven.objects.all()
    if  CustomUser.is_authenticated and CustomUser.is_directeur:
     return render(request, 'directeur.html',{'i':i})
def citoyen(request):
    if  CustomUser.is_authenticated and CustomUser.is_citoyen:
     return render(request, 'citoyen.html',)
#deconacter de compte utilisateur     
def logout_view(request):
    logout(request)  # Call the logout function
    return redirect('login_view')  # Redirect to the index page after logout
#affichage de tout les interventions
def affint(request):
    i=interven.objects.all()
    return render(request,"int.html",{'i':i})
#citoyen faire une demande de intervention 
def create_intervention(request):
    if CustomUser.is_citoyen:
        if request.method == 'POST':
            des = request.POST.get('des', '')
            date_creation = date.today().isoformat()  # Call today() to get the current date as a string
            date_debut = request.POST.get('dd')
            date_fin = request.POST.get('df')
            
            # Make sure to select all necessary fields from interven model
            # Replace `pk=1` with your actual query
            
            c = interven(description=des, date_debut=date_debut, date_fin=date_fin, date_creation=date_creation)
            c.save()
            # Redirect or do something on successful form submission
       
    else:
        return HttpResponse("Vous n'avez pas accès.")

    return render(request, 'formint.html')