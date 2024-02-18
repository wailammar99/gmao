from django.urls import path
from . import views

urlpatterns = [
    path('items', views.index, ),
     path('formitem', views.mon_vue_de_formulaire,),
     path('user/items/', views.user_items, name='user_items'),
     path('gestionmaitenacne',views.getionmaitenace,),
     path('register',views.registe,name='register'),
      path('login',views.user_login,name='login'),

     
   
    

]