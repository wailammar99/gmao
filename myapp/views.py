from django.shortcuts import render, redirect
from django.contrib import messages
from .decorators import *
from .serializers import *
from rest_framework.parsers import JSONParser,api_settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Equipement

from .forms import *
from django.contrib.auth import authenticate, login,logout
from django.contrib.auth import logout as django_logout
from datetime import *
from django.shortcuts import get_object_or_404

from django.utils.timezone import *
from .models import *
from django.contrib.auth.decorators import login_required,permission_required
from django.http import HttpResponse ,JsonResponse,response

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
     
     interventions= interven.objects.filter(technicien=request.user.id).select_related('service').prefetch_related('equipements')
     return render(request, 'technicien.html',{'interventions':interventions})
#la page de chef de service peut modifie les infomaation personal eet ausii assigne les technicne aux intervention 
@login_required_chef
def chefservice(request):
    if request.user.is_authenticated and request.user.is_chefservice:
        # Filter interventions based on the service of the logged-in user
        interventions = interven.objects.filter(service=request.user.service)
       
        return render(request, 'chefservice.html', {'i': interventions})
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
    s = service.objects.all()
    t = CustomUser.objects.filter(service=intervention.service)
    e=Equipement.objects.all()


    if request.method == 'POST':
        intervention.date_debut = request.POST.get('date_debut')
        intervention.date_fin = request.POST.get('date_fin')
        service_id = request.POST.get('id_service')
        technician_id = request.POST.get('technicians')

          # Get the selected service ID from the form
        
        

        if request.user.is_authenticated and request.user.is_chefservice and request.user.service.nom == "noservice":
            # Assign intervention to the service chef if user is a chef and belongs to the correct service
            intervention.technicien = None  # Unassign any previous technician
            intervention.etat = "Assigné"
            service_instance = get_object_or_404(service, pk=service_id)

       
            intervention.service = service_instance
        
        else:
            # Assign intervention to the selected technician
            technician_service = CustomUser.objects.filter(is_technicien=True, service=request.user.service).first()
            if technician_service:
                intervention.technicien =int(technician_id)
                intervention.etat = "Assigné"
                intervention.service = technician_service.service
                intervention.equipements.clear()  # Clear existing selection
                
            else:
                # Handle the case where no technician with the same service as the chef service is found
                return HttpResponse('No technician found with the same service as the chef service.', status=400)

        intervention.save()
        selected_equipments_ids = request.POST.getlist('equipements')  # Get the list of selected equipment IDs from the form
        selected_equipments = Equipement.objects.filter(pk__in=selected_equipments_ids)  # Get the selected equipment objects
        intervention.equipements.add(*selected_equipments)  # Add selected equipment to the intervention
        messages.success(request, 'Intervention updated successfully.')
        return redirect('chefservice')

    return render(request, 'modify_intervention.html', {'intervention': intervention, 's': s, 't': t,"e":e})
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
@csrf_exempt
def CustomerListet(request):
    if request.method == 'GET':
        users = CustomUser.objects.filter(is_technicien=True)
        serializer = CustomeUserSerializers(users, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        user_id = data.get('id')  # Assuming 'id' is provided in the request data
        user = CustomUser.objects.get(pk=user_id)
        serializer = CustomeUserSerializers(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        else:
            return JsonResponse(serializer.errors, status=400)
    
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    #api to show liste of intervention 
@csrf_exempt
def intervention(request):
    if request.method == 'GET':
        interventions = interven.objects.all()
        serializer = IntervetionSerializers(interventions, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        intervention_id = data.get('id')  # Assuming 'id' is provided in the request data
        intervention = interven.objects.get(pk=intervention_id)
        serializer = IntervetionSerializers(intervention, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
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
    
#api for equiment 
@api_view(['GET', 'POST'])
def equipement_list(request):
    if request.method == 'GET':
        equipements = Equipement.objects.all()
        serializer = EquimenentSerializers(equipements, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EquimenentSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
def equipement_detail(request, pk):
    try:
        equipement = Equipement.objects.get(pk=pk)
    except Equipement.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EquimenentSerializers(equipement)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = EquimenentSerializers(equipement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#methode pour le button de technocne appuyie pour demarer le intervetion 
def start_intervention(request):
    if request.method == 'POST':
        intervention_id = request.POST.get('id')
        intervention = interven.objects.get(pk=intervention_id)
        intervention.etat = "En cours"  # Update intervention status
        intervention.save()
        return redirect('technicien')
    else:
        return HttpResponse('Method Not Allowed', status=405)
#methode pour terminer le intervention par le technicine 
def finish_intervention(request):
    if request.method == 'POST':
        intervention_id = request.POST.get('id')
        intervention = interven.objects.get(pk=intervention_id)
        intervention.etat = "Terminé"  # Update intervention status
        intervention.save()
        return redirect('technicien')
    else:
        return HttpResponse('Method Not Allowed', status=405)