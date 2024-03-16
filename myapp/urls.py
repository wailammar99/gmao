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
            # path("listeservice",views.ServiceListe),
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
              path('startconversation', views.start_conversation, name='start_conversation'),

             
          
            

           # Add this URL pattern for logout

     
   
    

]