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
     path('logout/', views.logout_view, name='logout'),  # Add this URL pattern for logout

     
   
    

]