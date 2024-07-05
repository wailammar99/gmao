from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin


# Register your models here.
admin.site.register(CustomUser, UserAdmin)
admin.site.register(Equipement)
admin.site.register(interven)
admin.site.register(enatte) 

admin.site.register(converstation)
admin.site.register(message)
admin.site.register(Notification)
admin.site.register(service)
admin.site.register(Contact)
admin.site.register(Rapport)
admin.site.register(Enterprise)
