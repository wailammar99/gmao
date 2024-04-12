import json
from django.shortcuts import render, redirect
from django.contrib import messages
from .decorators import *
from .serializers import *
from django.contrib.auth.hashers import make_password
from rest_framework.parsers import JSONParser,api_settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
import jwt
from django.dispatch import receiver
from django.db.models.signals import post_save
from .permissions import *
from django.conf import settings
from .permissions import *
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Equipement
from django.http import JsonResponse, Http404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .forms import *
from django.utils import timezone

from django.contrib.auth import authenticate, login,logout
from django.contrib.auth import logout as django_logout
from datetime import *
from django.shortcuts import get_object_or_404

from django.utils.timezone import *
from .models import *
from django.contrib.auth.decorators import login_required,permission_required
from django.http import Http404, HttpResponse ,JsonResponse,response
from rest_framework.authtoken.models import Token

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
     
     interventions= interven.objects.filter(technicien=request.user.id).select_related('service').prefetch_related('equipements').select_related('conversation')
     c=converstation.objects.all()
     return render(request, 'technicien.html',{'interventions':interventions,'c':c})
#la page de chef de service peut modifie les infomaation personal eet ausii assigne les technicne aux intervention 
@login_required_chef
def chefservice(request):
    if request.user.is_authenticated and request.user.is_chefservice:
        # Filter interventions based on the service of the logged-in user
        interventions = interven.objects.filter(service=request.user.service)
        i=interven.objects.all()
        interventionenatte=interven.objects.filter(raison=True , service=request.user.service)
        c=converstation.objects.all()
      
        
        return render(request, 'chefservice.html', {'i': interventions,'enattete':interventionenatte,'c':c})
    else:
      
        return HttpResponse("You are not authorized to access this page.")
    

@login_required_directeur
def directeur(request):
    i=interven.objects.all()
    u=CustomUser.objects.all()
    technicians2 = CustomUser.objects.filter(id__in=i.values_list('technicien', flat=True))
    
    
    serializer_user = CustomeUserSerializers(u, many=True)
    serializer_interv=IntervetionSerializers(i,many=True)
    serializer_techncin=CustomeUserSerializers(technicians2,many=True)

    

   
    if  CustomUser.is_authenticated and CustomUser.is_directeur:
     return render(request, 'directeur.html',{'user': request.user,'i':i,'session': request.session,'u': u,"technicians":technicians2})
#la page de citoyen    
def citoyen(request):
    if  CustomUser.is_authenticated and CustomUser.is_citoyen:
     i=interven.objects.filter(citoyen=request.user)
     c=converstation.objects.all()
     cc=ConversationSerializers(c,many=True)
     serializab_intervention=IntervetionSerializers(i,many=True)
     
     
     return render(request, 'citoyen.html',{'session': request.session,'i':i,'cc':c})
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
        obj.raison=None
        obj.save()
        return redirect('chefservice')
#foction pour le chef service assigne une tech to technicien     
def assigne(request):
    if request.method == 'POST':
         # Add this line to see the contents of request.POST
        objet_id = request.POST.get('id')
        obj = get_object_or_404(interven, pk=objet_id)
        obj.etat='Assigné'
        obj.raison=None
        obj.save()
        return redirect('modify_intervention', intervention_id=objet_id)
#foction qui modifie etat from termine intoo cloture for chef service 
def cloture(request):
    if request.method=="POST":
        object_id=request.POST.get('id')
        obj=get_object_or_404(interven,pk=object_id)
        obj.etat='Clôture'
        obj.raison=None
        obj.save()
        return redirect('chefservice')

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
        users = CustomUser.objects.all().select_related('service')
        user_ser = CustomeUserSerializers(users, many=True)
        return JsonResponse(user_ser.data, status=200, safe=False)  # Use safe=False to allow serializing non-dictionary objects
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Assuming you have fields like username, password, email in your data
            user = CustomUser.objects.create(username=data['username'], password=data['password'], email=data['email'])
            user_ser = CustomeUserSerializers(user)
            return JsonResponse(user_ser.data, status=201)
        except KeyError:
            return JsonResponse({'error': 'Missing required fields'}, status=400)
   
        
    else :
        return JsonResponse({"error":"this methode not allow " },status=404)
@csrf_exempt
def CustomerListet(request):
    if request.method == 'GET':
        users = CustomUser.objects.filter(is_technicien=True)
        # Serialize queryset to JSON data
        serialized_users = serializers('json', users)
        return HttpResponse(serialized_users, content_type='application/json')
    elif request.method == 'PUT':
        
        pass
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    #api to show liste of intervention 
@csrf_exempt
def intervention(request):
    if request.method == 'GET':
        interventions = interven.objects.all().select_related("citoyen").select_related("service")
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
        intervention.etat = "En cours"
        #intervention.conversation=None
        #intervention.raison=None  # Update intervention status
        intervention.save()
        return redirect('technicien')
    else:
        return HttpResponse('Method Not Allowed', status=405)
#methode pour terminer le intervention par le technicine 
def finish_intervention(request):
    if request.method == 'POST':
        intervention_id = request.POST.get('id')
        intervention = interven.objects.get(pk=intervention_id)
        intervention.etat = "Terminé"
        #intervention.conversation=None
        #intervention.raison=None
          # Update intervention status
        intervention.save()
        return redirect('technicien')
    else:
        return HttpResponse('Method Not Allowed', status=405)
#technicien put faire une une rasion pourquoi le 
def cree_reason(request, id):
    if request.method == 'POST':
        intervention_id = request.POST.get('id')
        try:
            intervention = interven.objects.get(id=intervention_id)
            intervention.etat = "En attente"
            
            description = request.POST.get('description')
            date_de_creation = request.POST.get('date_de_creation')
            enatte_obj = enatte.objects.create(description=description, date_de_creation=date_de_creation)
            
            intervention.raison = enatte_obj
            intervention.save()
            
            return redirect("technicien")  # Redirect to success URL
        except interven.DoesNotExist:
            return render(request, 'tech.html')
    else:
        return render(request, 'cree_une_raison.html')
def topagecreeraison(request, id):
    intervention = interven.objects.get(id=id)
    return render(request, 'cree_une_raison.html', {'intervention': intervention})


def view_conversation(request, conversation_id):
    # Retrieve the conversation object based on the conversation_id
    conversation = get_object_or_404(converstation, pk=conversation_id)
    
    # Retrieve all messages associated with the conversation
    messages = conversation.message_set.all()
    
    # Render the template with the conversation and messages
    return render(request, 'conv.html', {'conversation': conversation, 'messages': messages})

# def cree_converstion(request):
#     if request.method=='POST':
#     intervention_id=request.POST.get('id')
#     try :
#         intervention=interven.objects.get(id=intervention_id)
#methdoe to send meeesage 
def sendmessage(request, conversation_id):
    # Retrieve the conversation object based on the conversation_id
    conversation = get_object_or_404(converstation, pk=conversation_id)
    
    if request.method == 'POST':
        try:
            # Get the logged-in user
            sender = request.user
            # Get the message content from the POST data
            message_content = request.POST.get('chat-window-message','')  # Ensure the key matches the form field
            if message_content:
                # Create and save the message object
                new_message = message.objects.create(converstation=conversation, sender=sender, contenu=message_content)
                return HttpResponse("Message sent successfully")
            else:
                return HttpResponse("Message content is empty")
        except Exception as e:
            return HttpResponse(f"An error occurred: {e}")
    
    # If the request method is not POST or the message content is empty,
    # render the template with the conversation
    return render(request, 'your_template.html', {'conversation': conversation})
@login_required
#foction de start conversation 
def start_conversation(request):
    if request.method == 'POST':
        # Retrieve the intervention ID from the POST data
        intervention_id = request.POST.get('intervention_id')
        
        # Create a new conversation
        conversation = converstation.objects.create(title=f"Conversation for Intervention {intervention_id}")
        intervention = get_object_or_404(interven, pk=intervention_id)
        intervention.conversation = conversation
        intervention.save()
        
        # Redirect to the view conversation page
        return redirect('view_conversation', conversation_id=conversation.id)
    
        # Handle GET request if needed
        
#reactttt consume api  
 #1.login api    
@csrf_exempt
def loginn(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
     
            
        
        if user is not None :
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            request.session['user_id'] = user.id
            # Determine the user's role
            if user.is_admin:
                role = 'admin'
            elif user.is_technicien:
                role = 'technicien'
            elif user.is_chefservice:
                role = 'chefservice'
            elif user.is_directeur:
                role = 'directeur'
            elif user.is_citoyen:
                role = 'citoyen'
            else:
                role = 'unknown'

            return JsonResponse({'message': 'login success','role': role, 'userId': user.id,'token': token.key})
        else:
            return JsonResponse({'error': 'invalid password or username'}, status=400)
    else:
        return JsonResponse({'error': 'only post request'}, status=405)
@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
def Serviceliste(request):
    if request.method == 'GET':
        s = service.objects.filter()
        serializer = ServiceSerializers(s, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        s_id = data.get('id')  # Assuming 'id' is provided in the request data
        s = service.objects.get(pk=s_id)
        serializer = ServiceSerializers(s, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        else:
            return JsonResponse(serializer.errors, status=400)
    
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
#api to get user info 
@csrf_exempt
def user_infoo(request, id):
    if request.method == 'GET':
        try:
            user = CustomUser.objects.get(id=id)
            serialized_user = CustomeUserSerializers(user)
            return JsonResponse({"user_info":serialized_user.data},status=200)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    elif request.method == 'PUT':
        # Extract the new information from the request
        new_username = request.POST.get('username')
        new_email = request.POST.get('email')
      
        # Update the user information in the database
        try:
            user = CustomUser.objects.get(id=id)
            user.username = new_username
            user.email = new_email
            user.save()
            return JsonResponse({'message': 'User information updated successfully'})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=405)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=406) 
@csrf_exempt

def create_service_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            servicename = data.get('nom')
            servicedes = data.get('descriptions')
            s = service.objects.create(nom=servicename, descrtions=servicedes)
            return JsonResponse({"message": "Creation successful"}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Creation failed"}, status=400)
@csrf_exempt
def api_create_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            directeur = CustomUser.objects.filter(is_directeur=True)
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            password1 = data.get('password1')
            password2 = data.get('password2')
            email = data.get('email')
            is_directeur = data.get('is_directeur', False)
            is_technicien = data.get('is_technicien', False)
            is_chefservice = data.get('is_chefservice', False)
            is_admin = data.get('is_admin', False)
            is_citoyen = data.get('is_citoyen', False)

            if CustomUser.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)

            if password1 == password2:
                hashed_password = make_password(password1)  # Hash the password

                if is_directeur:
                    CustomUser.objects.create(username=username, first_name=first_name, last_name=last_name, password=hashed_password, email=email, is_directeur=True, is_active=True)
                    return JsonResponse({'message': 'User created successfully'}, status=201)
                elif is_chefservice:
                    CustomUser.objects.create(username=username, password=hashed_password, first_name=first_name, last_name=last_name, email=email, is_chefservice=True, is_active=False)
                    return JsonResponse({'message': 'User created successfully'}, status=201)
                elif is_technicien:
                    CustomUser.objects.create(username=username, first_name=first_name, last_name=last_name, password=hashed_password, email=email, is_technicien=True, is_active=False)
                    return JsonResponse({'message': 'User created successfully'}, status=201)
                elif is_citoyen:
                    CustomUser.objects.create(username=username, password=hashed_password, first_name=first_name, last_name=last_name, email=email, is_citoyen=True, is_active=False)
                    return JsonResponse({'message': 'User created successfully'}, status=201)
                elif is_admin:
                    CustomUser.objects.create(username=username, password=hashed_password, first_name=first_name, last_name=last_name, email=email, is_admin=True, is_active=True)
                    return JsonResponse({'message': 'User created successfully'}, status=201)
                else:
                    return JsonResponse({'error': 'Forgot to specify the user role'}, status=401)
            else:
                return JsonResponse({'error': 'Passwords do not match'}, status=402)
        except Exception as e:
            return JsonResponse({'error': 'Failed to create user: {}'.format(str(e))}, status=406)
    else:
        return JsonResponse({'error': 'Method not allowed, only POST is allowed'}, status=400)
@csrf_exempt
def delete_user(request,id):
    if request.method=="DELETE":
       
        try :
            CustomUser.objects.filter(id=id).delete()
            return JsonResponse({"message":"utilistateur est bien supprimer"},status=200)
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "Utilisateur non trouvé"}, status=404)
        except Exception as e :
             return JsonResponse({"error": f"Échec de suppression de l'utilisateur: {str(e)}"}, status=405)
    else :
        return JsonResponse({"eroor":'methode not allowd'},status=405)            
@csrf_exempt 
def api_mofifie_user(request, id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            updated_data = data  # Assuming the entire user data is sent in the request body
            user = CustomUser.objects.get(pk=id)
            for key, value in updated_data.items():
                setattr(user, key, value)
            user.save()
            user_ser = CustomeUserSerializers(user)
            return JsonResponse(user_ser.data, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=406)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)
#
@csrf_exempt
def api_activer_compte(request,id):
    if request.method=='GET':
        try:
            
            user=CustomUser.objects.get(pk=id)
            if user.service is None:
                return JsonResponse({"eroor":"you need assigne service fisrt"},status=401)
            user.is_active=True
            user.save()
            return JsonResponse({'messgae':'le utilisateur est bien activer'},status=200)
        
        except Exception as e :
            return JsonResponse({"error":"failed to create user:{}".format(str(e))},status=400)
    else :
        return JsonResponse({'error':'methode not allows'},status=200)

@csrf_exempt
#chef servvice peut assigne service a intervetion 
def assign_service_or_technician(request, id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            new_service_id = data.get('service_id')
            equipment_ids = data.get('equipment_ids')
            start_date = data.get('start_date')  # Assuming start_date is passed in the request
            end_date = data.get('end_date')  # Assuming equipment IDs are passed in the request
            
            # Fetch the intervention instance using the ID
            intervention = interven.objects.get(id=id)
            
            if intervention.service.nom == 'noservice':
                # Assign service
                service_instance = service.objects.get(id=new_service_id)
                intervention.service = service_instance
                intervention.etat = "Nouveau"
            else:
                technicien=CustomUser.objects.get(id=new_service_id)
                
                # Assign technician
                intervention.technicien = new_service_id
                intervention.etat = "Assigné"
                intervention.raison=None
                intervention.date_debut=start_date
                intervention.date_fin=end_date
               
                    

                 
                  # Assuming you have the intervention object available
               
               
            
            # Add equipment to intervention
            if equipment_ids:
                for equipment_id in equipment_ids:
                    equipment_instance = Equipement.objects.get(id=equipment_id)
                    intervention.equipements.add(equipment_instance)
            
            intervention.save()
            message = "New intervention has been assigned to you"
            Notification.objects.create(recipient=technicien, message=message, is_read=False)
            
            return JsonResponse({"message": "Le service/technicien et les équipements sont bien assignés à l'intervention."}, status=200)
        except interven.DoesNotExist:
            return JsonResponse({"error": "Intervention with the provided ID does not exist."}, status=400)
        except service.DoesNotExist:
            return JsonResponse({"error": "Service with the provided ID does not exist."}, status=400)
        except Equipement.DoesNotExist:
            return JsonResponse({"error": "Equipment with the provided ID does not exist."}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"Failed to assign service/technician/equipment: {str(e)}"}, status=400)
    else:
        return JsonResponse({"error": "Méthode non autorisée."}, status=405)


@csrf_exempt  # Ensure the user is authenticated
#api ciotoyen peut voir onmy cest intervetion 
def api_intervetion_citoyen(request, id):
    if request.method == 'GET':
        try:
            user = CustomUser.objects.get(id=id)
            interventions = interven.objects.filter(citoyen=user).select_related("service").prefetch_related("conversation")

            serializer = IntervetionSerializers(interventions,many=True)
            return JsonResponse({"interventions": serializer.data}, status=200)
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)
        except Exception as e:
            return JsonResponse({"error": f"Failed to fetch interventions: {str(e)}"}, status=400)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)

@csrf_exempt
#nimport quel utiliateur peut modifie cest donne 
def api_mofifie_profil(request, id):
    if request.method == 'PUT':
        # Retrieve the user object based on the provided ID
        try:
            user = CustomUser.objects.get(id=id)  # Use CustomUser model
        

        # Update user data based on request payload
        # Example assuming request data is in JSON format
            data = json.loads(request.body)
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.first_name = data.get('firstname', user.first_name) 
            user.last_name = data.get('lastname', user.last_name) 
          
        # Update other fields as needed
        
        # Save the updated user object
            user.save()
            return JsonResponse({"message": "User updated successfully"})
        except Exception as e :
           return JsonResponse({"error": f"Failed to assign service: {str(e)}"}, status=400, safe=False)
   
        

    else:
        return JsonResponse({"error": "Only PUT requests are allowed"}, status=405)

@csrf_exempt
def api_create_intervention(request,id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            description = data.get('description')
            date_debut = data.get('date_debut')
            date_fin = data.get('date_fin')
            user_id = id
            

            # Check if required fields are present
            if description  is None:
                return JsonResponse({'error': 'Description, start date, and end date are required'}, status=400)

            # Create the intervention
            user = CustomUser.objects.get(id=user_id)
            noservice = service.objects.get(nom="noservice")
            intervention = interven.objects.create(
                description=description,
                
                etat="Nouveau",
                citoyen=user,
                service=noservice,
                date_creation=datetime.now()
            )

            return JsonResponse({'message': 'Intervention created successfully', 'id': intervention.id}, status=200)
        except Exception as e:
            return JsonResponse({'error': 'Failed to create intervention: {}'.format(str(e))}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed, only POST is allowed'}, status=400)
 #api too see all conversattion            
def conversationmessage(request, conversation_id):
    if request.method == "GET":
        try:
            # Filter messages by conversation ID
            messages = message.objects.filter(converstation_id=conversation_id)
            # Serialize messages
            serializer = MessageSerializer(messages, many=True)
            # Return serialized messages as JSON response
            return JsonResponse(serializer.data, status=200, safe=False)
        except message.DoesNotExist:
            # Handle case where conversation ID does not exist
            return JsonResponse({"error": "Conversation not found"}, status=404)
    else:
        # Handle unsupported HTTP methods
        return JsonResponse({"error": "Method not allowed"}, status=405)
#nimport queel ustilisateur peut faire une message 
@csrf_exempt
def sendmessage(request, conversation_id,user_id):
    if request.method =="POST":
        try:
            data = json.loads(request.body)
            

            
            # Retrieve conversation object
            conversation_obj = converstation.objects.get(id=conversation_id)
            user_new=CustomUser.objects.get(id=user_id)


            description = data.get("description")
            contenu = data.get("contenu")
            

            # Create message
            message_new = message.objects.create(
                converstation=conversation_obj,
                contenu=contenu,
                sender=user_new,
               
                message_type="public",
                horodatage=datetime.now()
            )

            return JsonResponse({"message": "Message created successfully"}, status=200)
        except Exception as e:
            return JsonResponse({'error': 'Failed to create message: {}'.format(str(e))}, status=400)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)

def api_intervetion_chefservice(request, user_id):
    if request.method == "GET":
        try:
            user = CustomUser.objects.get(id=user_id)
            user_service = user.service
            interventions = interven.objects.filter(service=user_service).select_related("service").prefetch_related("conversation").prefetch_related("equipements")
            serializer = IntervetionSerializers(interventions, many=True)
            # Access the serialized data directly
            
            return JsonResponse(serializer.data, status=200, safe=False)  # Set safe=False since we're returning a list
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': 'Failed to retrieve interventions: {}'.format(str(e))}, status=400)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)
def liste_technicien(request, id):
    if request.method == "GET":
        try:
            intervention = interven.objects.get(id=id)
            
            technicians = CustomUser.objects.filter(is_technicien=True, service=intervention.service)
            serializer = CustomeUserSerializers(technicians, many=True)
            return JsonResponse(serializer.data, status=200,safe=False)
        except interven.DoesNotExist:
            return JsonResponse({"error": "Intervention with the provided ID does not exist."}, status=404)
        except service.DoesNotExist:
            return JsonResponse({"error": "Service with the provided name does not exist."}, status=404)
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "No technicians found for the specified service."}, status=404)
        except Exception as e:
            return JsonResponse({'error': 'Failed to retrieve technicians: {}'.format(str(e))}, status=400)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)
@csrf_exempt  
def api_intervetion_techn(request, id):
    if request.method == "GET":
        try:
            user=CustomUser.objects.get(id=id)
 
            
            
            interventions = interven.objects.filter(technicien=user.id).select_related("service").prefetch_related("conversation").prefetch_related("equipements").select_related("raison")
            serialize = IntervetionSerializers(interventions, many=True)
            # Access the serialized data directly
           
            return JsonResponse(serialize.data, status=200,safe=False)  # Set safe=False since we're returning a list
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': 'Failed to retrieve interventions: {}'.format(str(e))}, status=400)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)
@csrf_exempt
#api start conversation 
def api_create_conversationn(request, id):
    if request.method == 'PUT':
        try:
            intervention_cible = interven.objects.get(id=id)
            data = json.loads(request.body)
            titre = data.get('title')
            
            # Create the conversation
            conversation = converstation.objects.create(title=titre)
            
            # Assign the conversation to the intervention
            intervention_cible.conversation = conversation
            intervention_cible.save()
            
            # Response message
            response_data = {'message': "Conversation bien créée"}
            
            return JsonResponse(response_data)
        except interven.DoesNotExist:
            return JsonResponse({"error": "L'intervention n'existe pas"}, status=404)
        except Exception as e:
            return JsonResponse({'error': 'Échec de la création de la conversation: {}'.format(str(e))}, status=400)
    else:
        return JsonResponse({"error": "La méthode n'est pas autorisée"}, status=405)
def api_liste_equipment(request):
    if request.method == "GET":
        eq = Equipement.objects.all()
        serializer = EquimenentSerializers(eq, many=True)  # Use correct serializer and remove 'safe' argument
        return JsonResponse(serializer.data, status=200, safe=False)  # Specify safe=False here
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405) 
#api to delete service 
@csrf_exempt 
def api_delete_service(request,id):
    if request.method=="DELETE":
     try :
         
         if service.objects.filter(id=id).delete() :
          return JsonResponse({"message":"le service est bien supprimer "},status=200)
     except service.DoesNotExist :
         return JsonResponse({"eroor:le service est intorvable "},status=400)
     except Exception as e :
        return JsonResponse({'error': 'Échec de la création de la conversation: {}'.format(str(e))}, status=400)
    else :
        return JsonResponse({"eroor:methode not allow"},status=405)
def intervention_detail_api(request, intervention_id):
    # Retrieve intervention from database or return 404 if not found
    intervention = get_object_or_404(interven, pk=intervention_id)

    # Serialize intervention data
    intervention_data = {
        'id': intervention.id,
        'description': intervention.description,
        'date_creation': intervention.date_creation,
        'date_debut': intervention.date_debut,
        'date_fin': intervention.date_fin,
        'etat': intervention.etat,
        # Add other fields as needed
    }

    # Return JSON response
    return JsonResponse(intervention_data)
#api to chaange etat de intervetion into annuler 
@csrf_exempt
def api_refuse_intervetion(request,intervetion_id):
    if request.method=="GET" :
      try:
        intervention=interven.objects.get(id=intervetion_id)
        intervention.etat="Annulé"
        intervention.save()
        return JsonResponse({"message":"le intervztion est bien modifie "})
      except interven.DoesNotExist :
          return JsonResponse({"eroor:le intervtion not found "},status=404)
      except Exception as e :
          return JsonResponse({'error': 'Échec de la création de la conversation: {}'.format(str(e))}, status=403)
    else :
        return JsonResponse({"eroor:le methode not allow"},status=400)
@csrf_exempt
def api_directeur_assgige(request, id):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            service_id = data.get("service_id")
            service_cible = service.objects.get(id=service_id)
            user_cible = CustomUser.objects.get(id=id)
            user_cible.service = service_cible
            user_cible.save()
            return JsonResponse({"message": "L'utilisateur a été assigné avec succès."})
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "L'utilisateur n'est pas valide."}, status=404)
        except service.DoesNotExist:
            return JsonResponse({"error": "Le service n'est pas valide."}, status=405)
        except Exception as e:
            return JsonResponse({'error': 'Échec de l\'assignation de l\'utilisateur: {}'.format(str(e))}, status=403)
    else:
        return JsonResponse({"error": "La méthode n'est pas autorisée."}, status=405)


#************api of techrcchncine #
#api turn etat de inetrvetion into "en cour "

@csrf_exempt
def api_demarer_inetrvetion(request,intervtion_id):
    if request.method=="PUT":
     
     try :
        interveton_cible=interven.objects.get(id=intervtion_id)
        chefservice=CustomUser.objects.filter(service=interveton_cible.service)
        interveton_cible.etat="En cours"
        interveton_cible.save()
        message = f"Intervention has been started for {interveton_cible.technicien}."
        for user in chefservice:
                Notification.objects.create(recipient=user, message=message, is_read=False)
        return JsonResponse({"message":"le inetrvetion est encour "},status=200)
     except interven.DoesNotExist :
         return JsonResponse({"eroor:inetrvtion do not existe "},status=404)
     except Exception as e :
         return JsonResponse({'error': 'i cant start inetrvetion beacause : {}'.format(str(e))}, status=403)
    else :
        return JsonResponse({"eroor:methdoe not allow "},status=405)
@csrf_exempt
#api to turn etat into "terminer "
def api_finish_inetrvetion(request,intervtion_id):
    if request.method=="PUT":
     try :
        
        interveton_cible=interven.objects.get(id=intervtion_id)
        chefservice=CustomUser.objects.filter(service=interveton_cible.service)
        interveton_cible.etat="Terminé"
        interveton_cible.save()
        message = f"Intervention has been finish for {interveton_cible.technicien}."
        for user in chefservice:
                Notification.objects.create(recipient=user, message=message, is_read=False)
        return JsonResponse({"message":"le inetrvetion est Terminé "},status=200)
     except interven.DoesNotExist :
         return JsonResponse({"eroor:inetrvtion do not existe "},status=404)
     except Exception as e :
         return JsonResponse({'error': 'i cant start inetrvetion beacause : {}'.format(str(e))}, status=403)
    else :
        return JsonResponse({"eroor:methdoe not allow "},status=405)
#api modfie interveztion and create raiosn 
@csrf_exempt 
def api_create_raison(request,intervtion_id):
    if request.method == "PUT":
        try:
            intervention_cible = interven.objects.get(id=intervtion_id)
            chefservice=CustomUser.objects.filter(service=intervention_cible.service)
            data = json.loads(request.body)
            description = data.get("description")
            if description is None:
                return JsonResponse({"message": "La description est obligatoire pour un état en attente"}, status=404)
            
            raison_cible = enatte.objects.create(description=description)
            intervention_cible.raison = raison_cible
            intervention_cible.etat="En attente"
            intervention_cible.save()
            message = f"Intervention has been pause  for {intervention_cible.technicien}."
            for user in chefservice:
                Notification.objects.create(recipient=user, message=message, is_read=False)

            
            return JsonResponse({"message": "La raison de l'attente a été ajoutée avec succès à l'intervention"}, status=200)
        
        except interven.DoesNotExist:
            return JsonResponse({"error": "L'intervention n'existe pas"}, status=404)
        
        except Exception as e:
            return JsonResponse({'error': 'Impossible de démarrer l\'intervention à cause de : {}'.format(str(e))}, status=403)
    
    else:
        return JsonResponse({"error": "Méthode non autorisée"}, status=403)
@csrf_exempt
def api_assigne_service_user (request,user_id):
    if request.method=="PUT" :
      try: 
        data=json.loads(request.body)
        service_id=data.get("service_id")
        service_cible=service.objects.get(id=service_id)
        user=CustomUser.objects.get(id=user_id)
        user.service=service_cible
        user.save()
        return JsonResponse({"message":"le service est bien assigne "},status=200)
      except CustomUser.DoesNotExist :
          return JsonResponse({"eroor":"le utilistaeur not found "},status=404)
      except Exception  as e :
       return JsonResponse({'error': 'Impossible de démarrer l\'intervention à cause de : {}'.format(str(e))}, status=403)
    else :
        return JsonResponse({"eroor:methode not allow "},status=405)
def api_notification_liste(request,user_id):
    if request.method=="GET":
        try :
            user=CustomUser.objects.get(id=user_id)
            notification=Notification.objects.filter(recipient=user)
            serializer=NotificationSerialize(notification,many=True)
            return response(serializer.data)
        except CustomUser.DoesNotExist :
            return JsonResponse({"eroor":"user do not exite"},status=404)
        except Notification.DoesNotExist :
            return JsonResponse({"eroor":"notification do not exttse "},status=404)
        except Exception as e :
               return JsonResponse({'error': 'Impossible de démarrer l\'intervention à cause de : {}'.format(str(e))}, status=403)
    else :
        return JsonResponse({"eooor":"methode not allow "},statut=405)
def api_liste_technicien_par_service(request,user_id):
    if request.method=="GET":
      try:
        user=CustomUser.objects.get(id=user_id)
        service=user.service
        technicien=CustomUser.objects.filter(service=service ,is_technicien=True)
        serializer=CustomeUserSerializers(technicien,many=True).data
        return JsonResponse(serializer,status=200,safe=False)
      except CustomUser.DoesNotExist :
          return JsonResponse({"eroor":"Customer user do not exite"},status=404)
      except Exception as e :
               return JsonResponse({'error': 'Impossible de démarrer l\'intervention à cause de : {}'.format(str(e))}, status=403)
    else :
       return JsonResponse({"eroor":"Customer user do not exite"},status=405)
#systeme de notifacion 
@csrf_exempt
def api_liste_notification_unread(request, user_id):
    if request.method == "GET":
        try:
            user = CustomUser.objects.get(id=user_id)
            notif_cible = Notification.objects.filter(recipient=user,is_read=False )
            serializer = NotificationSerialize(notif_cible, many=True)
            return JsonResponse(serializer.data, status=200,safe=False)
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)
        except Notification.DoesNotExist:
            return JsonResponse({"error": "Notifications do not exist"}, status=404)
        except Exception as e:
            return JsonResponse({'error': 'Error retrieving notifications: {}'.format(str(e))}, status=403)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=401)
@csrf_exempt
def api_change_statu_notification(request,user_id):
    if request.method=="PUT" :
        try :
            user=CustomUser.objects.get(id=user_id)
            notificationn=Notification.objects.filter(recipient=user)
            for n in notificationn :
                n.is_read=True 
                n.save()
            
            
            return JsonResponse({'message':"all your ntofication is now readeere"},status=200)
        except Notification.DoesNotExist :
            return JsonResponse({"eooor":"notification do not existe "},status=404)
        except Exception as e:
            return JsonResponse({'error': 'Error retrieving notifications: {}'.format(str(e))}, status=403)
    else :
        return JsonResponse({"eoor":"methode do not allow"},status=405)
                 
def api_all_nofication(request,user_id):
    if request.method=="GET" :
        try :
            user=CustomUser.objects.get(id=user_id)
            notif=Notification.objects.filter(recipient=user).order_by('created_at')
            serializer=NotificationSerialize(notif,many=True)
            return JsonResponse(serializer.data,status=200,safe=False)
        except CustomUser.DoesNotExist :
            return JsonResponse({"eroor":"user do not existe "},status=404)
        except Exception as e:
            return JsonResponse({'error': 'Error retrieving notifications: {}'.format(str(e))}, status=403)
    else :
        return JsonResponse({"eroor":"le method do not existe "},status=405)
@csrf_exempt
def api_delete_notification_one(request,notification_id):
 if request.method=="DELETE" :
  try :
      Notification.objects.filter(id=notification_id).delete()
      return JsonResponse({'message':"notiifcation delete with succces"},status=200)
  except Notification.DoesNotExist :
      return JsonResponse({"eooor":"notiifcation do not exite "},status=404)
  except Exception as e :
      return JsonResponse({'error': 'Error retrieving notifications: {}'.format(str(e))}, status=403)
 else :
     return JsonResponse({"eroor":"method not allow "},status=405)
#api cloture le intervetion 
@csrf_exempt
def api_cloture_inetrvetion (request,intervtion_id):
 if request.method=="PUT" :
   try:
       intervetion_cible=interven.objects.get(id=intervtion_id)
       intervetion_cible.etat="Clôture"
       intervetion_cible.save()
       return JsonResponse({"message":"le intervetion est bien cloture "},status=200)
   except interven.DoesNotExist :
       return JsonResponse({"eoor":"cat find id of intervetion  "},status=404)
   except Exception as e :
       return JsonResponse({'error': 'Error retrieving notifications: {}'.format(str(e))}, status=403)
 else :
     return JsonResponse({"eoor":"methode not alllow "},status=405)
@csrf_exempt
def api_change_password(request, user_id):
    if request.method =='PUT':
        try:
            user = CustomUser.objects.get(id=user_id)
            data = json.loads(request.body.decode('utf-8'))  # Decode request body
            old_password = data.get("old_password")
            password1 = data.get("password1")
            password2 = data.get("password2")
            
            # Check if old password matches
            if not user.check_password(old_password):
                return JsonResponse({"error": "Old password does not match"}, status=400)

            # Check if new passwords match
            if password1 != password2:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            # Set new password
            user.set_password(password1)
            user.save()
            return JsonResponse({"message": "Password changed successfully"}, status=200)
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": "An error occurred: {}".format(str(e))}, status=500)
    else:
        return JsonResponse({"message": "Method not allowed"}, status=405)