from functools import wraps
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from rest_framework import *
from django.http import Http404, HttpResponse ,JsonResponse,response


def login_required_admin(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated and request.user.is_admin:
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({"eroor":"ta pas autirisation de entrer cette page "},status=405)
    return wrapped_view

def login_required_technicien(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated and request.user.is_technicien:
            return view_func(request, *args, **kwargs)
        else:
            return redirect('login_view')
    return wrapped_view

# Similarly, define decorators for other roles like chef service, directeur, citoyen

def login_required_chef(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated and request.user.is_chefservice:
            return view_func(request, *args, **kwargs)
        else:
            return redirect('login_view')
    return wrapped_view
# Define views for other roles using similar decorators
def login_required_citoyen(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated and request.user.is_citoyen:
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse({"eroor":"vvous avaey pase le permission "},status=405)
    return wrapped_view
def login_required_directeur(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated and request.user.is_directeur:
            return view_func(request, *args, **kwargs)
        else:
            return redirect('login_view')
    return wrapped_view
# Define views for other roles using similar decorators


