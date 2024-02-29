from django.shortcuts import render, redirect
from .forms import SignUpForm, LoginForm
from django.contrib.auth import authenticate, login,logout
from .models import CustomUser

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
                msg = 'Invalid credentials'
        else:
            msg = 'Error validating form'
    return render(request, 'login.html', {'form': form, 'msg': msg})

def admin(request):
    return render(request, 'admin.html')

def technicien(request):
    return render(request, 'technicien.html')

def chefservice(request):
    return render(request, 'chefservice.html')

def directeur(request):
    return render(request, 'directeur.html')
def citoyen(request):
    return render(request, 'citoyen.html')
def logout_view(request):
    logout(request)  # Call the logout function
    return redirect('login_view')  # Redirect to the index page after logout