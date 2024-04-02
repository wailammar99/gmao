from django.urls import path
from . import views

urlpatterns = [
     path('login/', views.login_view, name='login_view'),
    path('register/', views.register, name='register'),
    path('adminpage/', views.admin, name='adminpage'),
    path('chefservice/', views.chefservice, name='chefservice'),
    path('directeur/', views.directeur, name='directeur'),
    path('technicien/', views.technicien, name='technicien'),
    path('citoyen/', views.citoyen, name='citoyen'),
     path('logout/', views.logout_view, name='logout'),
     path('int/',views.create_intervention,name='int'),
       path('affint/',views.affint) ,
        path('profil/',views.modifielesnifomation,name="modifielesnifomation"),
          path('refuser/', views.refuser, name='refuser'),
           path('assigne/', views.assigne, name='assigne'),
           path('admiin/', views.admin, name='admin'),
           path('active/', views.activer, name='active'),
            path('modify-intervention/<int:intervention_id>/', views.modify_intervention, name='modify_intervention'),
            path('listecustomer/',views.CustomerListe,name="cc"),
             path('listecustomer/is_technicine',views.CustomerListet),
             path('intervention/',views.intervention),
             path("listeservice",views.Serviceliste),
            path("createservice",views.create_service,name="createservice"),
             path('modify-service/', views.modify_service_page, name='modify_service_page'),
             path('equipements/', views.equipement_list),
              path('equipements/<int:pk>/', views.equipement_detail),
              path("start_intervention",views.start_intervention,name="start_intervention"),
              path("finish_intervention",views.finish_intervention,name="finish_intervention"),
              path("intervention/<int:id>",views.cree_reason,name="raison"),
             path('cree_raison/<int:id>', views.topagecreeraison, name='en'),
             path('cloture',views.cloture,name='cloture'),
             path('conversation/<int:conversation_id>/', views.view_conversation, name='view_conversation'),
              path('sendmessage/<int:conversation_id>/', views.sendmessage, name='sendmessage'),
              
               path('login_react/', views.loginn ,name="login_react"),
                path('logoot/', views.logout_view , name='logoutt'),
                path("Serviceliste/",views.Serviceliste),
                 path('user_infoo/<int:id>/', views.user_infoo, name='user_info'),
                path("api_create_service/",views.create_service_api),
                path("api_create_user/",views.api_create_user),
                path('api_delete_user/<int:id>', views.delete_user, name='delete_user'),
                path('api_mofifie_user/<int:id>/', views.api_mofifie_user, name='api_mofifie_user'),
                path('api_activer_compte/<int:id>/', views.api_activer_compte, name='api_active_compte'),
                path('api_assigne_service/<int:id>',views.assign_service_or_technician),
                path('api_intervetion_citoyen/<int:id>/',views.api_intervetion_citoyen),
                path("api_modfie_profil/<int:id>/",views.api_mofifie_profil),
                path("api_create_intervention/<int:id>/",views.api_create_intervention),
                path("conversation/<int:conversation_id>/messages/",views.conversationmessage),
                 path('conversation/<int:conversation_id>/citoyen/<int:user_id>/',views.sendmessage),
                 path("api_intervetion_chefservice/<int:user_id>/",views.api_intervetion_chefservice),
                 path("liste_technicien/<int:id>/",views.liste_technicien),
                 path('liste_intervetion_technicien/<int:id>/',views.api_intervetion_techn),
                 path('api_create_converstion/<int:id>/',views.api_create_conversationn),
                 path("liste_equipment/",views.api_liste_equipment),
                 path("delete_service/<int:id>/",views.api_delete_service),
                  path('api/intervention/<int:intervention_id>/', views.intervention_detail_api),
                  path("api_refuse_intervention/<int:intervetion_id>/",views.api_refuse_intervetion),
                  path("api_directeur_assgige/<int:id>/",views.api_directeur_assgige),
                  path("api_demarer_inetrvetion/<int:intervtion_id>/",views.api_demarer_inetrvetion),
                    path("api_finish_inetrvetion/<int:intervtion_id>/",views.api_finish_inetrvetion),
                     path("api_create_raison/<int:intervtion_id>/",views.api_create_raison),
                
          
            

           # Add this URL pattern for logout

     
   
    

]