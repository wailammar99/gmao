from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin


# Register your models here.
class CustomUserAdmin(admin.ModelAdmin):
    model = CustomUser
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_active','service',"enterprise","get_role_display")  
class IntervetionAdmin(admin.ModelAdmin):
    model=interven
    list_display=("id","service","technicien","citoyen","enterprise","etat")
class ServiceAdmin(admin.ModelAdmin):
    model=service
    list_display=("id","nom","enterprise")

class EnpriseAdmin(admin.ModelAdmin):
    model=Enterprise
    list_display=('id','name')
admin.site.register(Enterprise,EnpriseAdmin)
admin.site.register(CustomUser,CustomUserAdmin)
admin.site.register(Equipement)
admin.site.register(interven,IntervetionAdmin)
admin.site.register(enatte) 

admin.site.register(converstation)
admin.site.register(message)
admin.site.register(Notification)
admin.site.register(service,ServiceAdmin)
admin.site.register(Contact)
admin.site.register(Rapport)

