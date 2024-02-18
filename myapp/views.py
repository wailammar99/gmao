from django.shortcuts import render,redirect
from django.http import HttpResponse
from .models import Item,formitems,gestionmaitenace,ing,worker
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from django.contrib import messages

from django.contrib.auth.decorators import login_required



def index(request):
    items = Item.objects.all()
    
    return render(request, 'items.html', {'i': items})


@login_required
def mon_vue_de_formulaire(request):
    if request.method == 'POST':
        form = formitems(request.POST)
        if form.is_valid():
            # Créer une instance de l'objet Item en associant l'utilisateur actuel
            item = form.save(commit=False)
            item.user = request.user  # Ajoutez l'utilisateur actuel à l'objet Item.
            item.save()
            return HttpResponse('login suucdj')
    else:
        form = formitems()
    return render(request, 'mon_itemform.html', {'form': form})
@login_required
def user_items(request):
    items = Item.objects.filter( )
    return render(request, 'user_items.html', {'items': items})  

def getionmaitenace(request):
    g=gestionmaitenace.objects.all()
    return render(request,'gtm.html',{'gestion':g})
def registe(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        pass1 = request.POST.get('pass1')
        pass2 = request.POST.get('pass2')
        roles = request.POST.getlist('role')  # Get list of selected roles
        
        if pass1 == pass2:
            if User.objects.filter(email=email).exists():
                messages.info(request, "Email already exists")
            elif User.objects.filter(username=username).exists():
                messages.info(request, "Username already in use")
            else:
                user = User.objects.create_user(username=username, email=email, password=pass1)
                user.is_staff = True  # Assuming all registered users are staff
                user.is_superuser = 'admin' in roles  # Check if 'admin' role is selected
                user.save()
                messages.success(request, "Registration successful")
                
                # Create instances based on roles
                if 'engineer' in roles:
                    ingg = ing.objects.create(u=username,mail=email, nom="", prenom="", adresse="", phone="")
                    ingg.save()
                    return render(request, 'ing.html', {'user': user, 'ing': ingg})
                
                if 'worker' in roles:
                    w = worker.objects.create(u=username,email=email, nom="", prenom="", adresse="", phone="")
                    w.save()
                    return render(request, 'worker.html', {'user': user, 'worker': w})
        else:
            messages.error(request, "Passwords do not match")
    return render(request, 'registe.html')  # Render the registration page if not a POST request or errors occur
def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            if ing.objects.filter(u=user).exists():
                
                login(request, user)
                messages.success(request, "Login successful")
                return render(request, 'ing.html')
            elif worker.objects.filter(u=user).exists():
                login(request, user)
                messages.success(request, "Login successful")
                return render(request, 'worker.html')
        else:
            messages.error(request, "Invalid username or password")
            return redirect('user_login')  # Redirect to the login page

    # If request method is GET, render the login form
    return render(request, 'login.html', {'messages': messages.get_messages(request)})

# Create your views here.
