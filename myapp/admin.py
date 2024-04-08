from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Equipement)
admin.site.register(interven)
admin.site.register(enatte)
admin.site.register(converstation)
admin.site.register(message)
admin.site.register(Notification)