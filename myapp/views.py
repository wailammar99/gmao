from django.shortcuts import render, redirect
from django.contrib import messages
from .decorators import *
from .serializers import *
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt

from .forms import *
from django.contrib.auth import authenticate, login,logout
from django.contrib.auth import logout as django_logout
from datetime import *
from django.shortcuts import get_object_or_404

from django.utils.timezone import *
from .models import *
from django.contrib.auth.decorators import login_required,permission_required
from django.http import HttpResponse ,JsonResponse

def index(request):
    return render(request, 'index.html')
#le foction de admin cree une compte citoyen ,chef service , directeur ,
@login_required_admin
#admin peut cree des compte citoyen chef service and dircteur tchnicine 
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

#auth multipe for all type fo role
def login_view(request):
    form = LoginForm(request.POST or None)
    msg = None
    
    if request.method == 'POST':
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None and user.is_active:  # Check if the user is active
                login(request, user)
                if user.is_admin:
                    request.session['admin_season'] = True
                    return redirect('admin')
                elif user.is_technicien:
                    request.session['technicien_season'] = True
                    return redirect('technicien')
                elif user.is_chefservice:
                    request.session['chefservice_season'] = True
                    return redirect('chefservice')
                elif user.is_directeur:
                    request.session['directeur_season'] = True
                    return redirect('directeur')
                elif user.is_citoyen:
                    request.session['citoyen_season'] = True
                    return redirect('citoyen')
                else:
                    return redirect('index')  # Redirect to default page
            elif user is not None and not user.is_active:
                msg = 'Your account is not active. Please contact the administrator.'
            else:
                msg = 'Invalid username or password'
        else:
            msg = 'Error validating form'
    return render(request, 'login.html', {'form': form, 'msg': msg})
@login_required_admin
def admin(request):
    if  CustomUser.is_authenticated and CustomUser.is_admin:
     s=service.objects.all()
     ss=ServiceSerializers(s,many=True)

     return render(request, 'admin.html',{'s':ss.data})
#la page technicine 
@login_required_technicien
def technicien(request):
   
   if  CustomUser.is_authenticated and CustomUser.is_technicien: 
     
     i = interven.objects.filter(technicien=request.user.id)
     serialized_interventions = IntervetionSerializers(i, many=True)
     return render(request, 'technicien.html',{'i':serialized_interventions.data})
#la page de chef de service peut modifie les infomaation personal eet ausii assigne les technicne aux intervention 
@login_required
def chefservice(request):
    if request.user.is_authenticated and request.user.is_chefservice:
        # Filter interventions based on the service of the logged-in user
        interventions = interven.objects.filter(service=request.user.service)
        serializer_intervention = IntervetionSerializers(interventions, many=True)
        return render(request, 'chefservice.html', {'i': serializer_intervention.data})
    else:
        # Redirect or handle unauthorized access
        return HttpResponse("You are not authorized to access this page.")
    

@login_required_directeur
def directeur(request):
    i=interven.objects.all()
    u=CustomUser.objects.all()
    
    serializer_user = CustomeUserSerializers(u, many=True)
    serializer_interv=IntervetionSerializers(i,many=True)
    

   
    if  CustomUser.is_authenticated and CustomUser.is_directeur:
     return render(request, 'directeur.html',{'i':serializer_interv.data,'session': request.session,'u': serializer_user.data})
#la page de citoyen    
def citoyen(request):
    if  CustomUser.is_authenticated and CustomUser.is_citoyen:
     i=interven.objects.filter(citoyen=request.user)
     serializab_intervention=IntervetionSerializers(i,many=True)
     
     
     return render(request, 'citoyen.html',{'session': request.session,'i':serializab_intervention.data})
#deconacter de compte utilisateur     
def logout_view(request):
    if request.session.get('admin_season'):
        del request.session['admin_season']
    elif request.session.get('technicien_season'):
        del request.session['technicien_season']
    elif request.session.get('chefservice_season'):
        del request.session['chefservice_season']
    elif request.session.get('directeur_season'):
        del request.session['directeur_season']
    elif request.session.get('citoyen_season'):
        del request.session['citoyen_season']
    
    django_logout(request)
    return redirect('login_view')
#affichage de tout les interventions
def affint(request):
    i=interven.objects.all()
    return render(request,"int.html",{'i':i})
#citoyen faire une demande de intervention 
@login_required_citoyen
def create_intervention(request):
    service_instance = get_object_or_404(service, nom="noservice")
    
    if request.user.is_authenticated and request.user.is_citoyen:
        if request.method == 'POST':
            # Get the id of the logged-in user
            des = request.POST.get('des', '')
            date_creation = date.today().isoformat()  # Call today() to get the current date as a string
            date_debut = request.POST.get('dd')
            date_fin = request.POST.get('df')
            citoyen = request.user
            
            c = interven(description=des, date_debut=date_debut, date_fin=date_fin, date_creation=date_creation, citoyen=citoyen,service_id=service_instance.id)
            c.save()
            return redirect('citoyen')
            # Redirect or do something on successful form submission

    else:
        return HttpResponse("Vous n'avez pas accès.")

    return render(request, 'formint.html')
#foction de chnage les infomation personalle de tout les utilisateur 
@login_required
def modifielesnifomation(request):
    if request.method == 'POST':
        # Get the current user's ID
        user_id = request.user.id

        # Retrieve the user from the database
        user = CustomUser.objects.get(id=user_id)

        # Update the user information
        user.email = request.POST.get('email')
        user.first_name = request.POST.get('first_name')
        user.last_name = request.POST.get('last_name')
        

        # Save the updated user information
        user.save()
        if user.is_directeur :
         return redirect('directeur')
        elif user.is_chefservice :
             return redirect('chefservice')
        elif user.is_technicien :
            return redirect('technicien')
        elif user.is_admin :
            return redirect("admin")
        elif user.is_citoyen :
            return redirect("citoyen")
        # Redirect to the profile page after updating

    # If the request method is not POST, render the form template
    return render(request, 'profil.html', {'user': request.user})
#focntion chef service refuse la demande de maitenace  
def refuser (request):
    
     if request.method == 'POST':
        objet_id = request.POST.get('id')
        obj = get_object_or_404(interven, pk=objet_id)
        obj.etat='Annulé'
        obj.save()
        return redirect('chefservice')
#foction pour le chef service assigne une tech to technicien     
def assigne(request):
    if request.method == 'POST':
        print(request.POST)  # Add this line to see the contents of request.POST
        objet_id = request.POST.get('id')
        obj = get_object_or_404(interven, pk=objet_id)
        obj.etat='Assigné'
        obj.save()
        return redirect('modify_intervention', intervention_id=objet_id)

#formation pour assigbne kles technicine 
@login_required_chef
def modify_intervention(request, intervention_id):
    intervention = get_object_or_404(interven, pk=intervention_id)
    s=service.objects.all()
    
    # Check if the user is a chef and belongs to the correct service
    if request.user.is_authenticated and request.user.is_chefservice and request.user.service.nom == "noservice":
        chef = CustomUser.objects.filter(is_chefservice=True)
        assign_to = 'service chef'
    else:
        # Assign intervention to the service chef
        service_chef = CustomUser.objects.filter(service=request.user.service, is_technicien=True)
        technicians = [service_chef]
        assign_to = 'technician' 

    if request.method == 'POST':
        intervention.date_debut = request.POST.get('date_debut')
        intervention.date_fin = request.POST.get('date_fin')
        service_id = request.POST.get('id_service')  # Get the selected service ID from the form
        service_instance = service.objects.get(id=service_id)  # Retrieve the service instance from the database
    
    
        if assign_to == 'technician':
            technician_id = request.POST.get('technicians')  # Assuming this is the ID of the technician
            intervention.technicien = technician_id
            intervention.etat = "Assigné"
        else:
            intervention.technicien = None  # Unassign any previous technician
            intervention.etat = "Assigné"
            intervention.service=service_instance

        intervention.save()
        messages.success(request, 'Intervention updated successfully.')
        return redirect('chefservice')
    
    return render(request, 'modify_intervention.html', {'intervention': intervention, 's': s})

def activer(request):
    if request.POST :
        if request.method == 'POST':
         objet_id = request.POST.get('id')
         obj = get_object_or_404(CustomUser, pk=objet_id)
         obj.is_active=True
         obj.save()
         return redirect(directeur)
        
#rest full api test Customer    


@csrf_exempt
def CustomerListe(request):
    if request.method == 'GET':
        users = CustomUser.objects.all()
        serializer = CustomeUserSerializers(users, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = CustomeUserSerializers(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        else:
            return JsonResponse(serializer.errors, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    

# def ServiceListe(request):
#     if request.method == 'GET':
#         s = service.objects.all()
#         serializer_service = ServiceSerializers(s, many=True)
#         return render(re)
    

def create_service(request):
    if request.method == 'POST':
        form = formservice(request.POST)  # Pass request.POST data to the form
        if form.is_valid():
            form.save()
            return redirect('admin')  # Redirect to a success page upon successful form submission
    else:
        form = formservice()
    return render(request, 'serviceform.html', {'form': form})
def createservice(request):
    return render(request,'createservice.html')
#assige un user his service par directeur 
def modify_service_page(request):
    services = service.objects.all()
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        user = CustomUser.objects.get(id=user_id)
        return render(request, 'modify_service_form.html', {'user': user, 's': services})
    elif request.method == 'POST':
        user_id = request.POST.get('user_id')
        new_service_id = request.POST.get('service_id')
        user = CustomUser.objects.get(id=user_id)
        user.service_id = new_service_id
        user.save()
        return redirect('directeur')  # Redirect to the Directeur page after modifying service