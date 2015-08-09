from django.shortcuts import render

from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.template import RequestContext, loader
from django.contrib.auth import get_user_model

from django.contrib.auth import authenticate, login
from . import models
from django.contrib import messages

def render_registration_form(request):
    template = loader.get_template('templates/index.html')
    context = RequestContext(request, {"form": models.RegistrationForm()})

    return HttpResponse(template.render(context))

def render_login_form(request):
    template = loader.get_template('templates/login.html')
    context = RequestContext(request, {"form": models.LoginForm()})

    return HttpResponse(template.render(context))

def retrieve_registration_form(request):
    form = models.RegistrationForm(request.POST)

    login = request.POST.get('login')
    valid, msg = form.is_valid()
    if valid:
        passwd = request.POST.get('password')
        user = get_user_model().objects.create_user(username=login, password=passwd,email='d@d.d')

        return HttpResponseRedirect(reverse('auth:login'))
    else:
        messages.add_message(request, messages.INFO, msg)

        response = HttpResponseRedirect(reverse('auth:registration'))
        return response

def retrieve_login_form(request):
    form = models.LoginForm(request.POST)

    if form.is_valid():
        user = authenticate(username=request.POST['login'], password=request.POST["password"])

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('blog:home'))
        else:
            response = HttpResponseRedirect(reverse('auth:login'))
            messages.add_message(request, messages.INFO, 'Current user is not registred yet')

            return response
    else:
        messages.add_message(request, messages.INFO, 'Fill required fields')

        response = HttpResponseRedirect(reverse('auth:login'))
        return response

def handle_all(request):
    return HttpResponseRedirect(reverse('blog:home'))