from django.shortcuts import render

from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.template import RequestContext, loader
from django.contrib.auth import get_user_model

from django.contrib.auth import authenticate, login

# Create your views here.

def render_registration_form(request):
    template = loader.get_template('templates/index.html')
    context = RequestContext(request, {})

    return HttpResponse(template.render(context))

def render_login_form(request):
    template = loader.get_template('templates/login.html')
    context = RequestContext(request, {})

    return HttpResponse(template.render(context))

def retrieve_registration_form(request):
    login = request.POST.get('login')
    email = request.POST.get('email')
    passwd = request.POST.get('passwd')

    user = get_user_model().objects.create_user(username=login, email=email, password=passwd)

    return HttpResponseRedirect(reverse('auth:login', args=()))

def retrieve_login_form(request):
    username = request.POST.get('login')
    passwd = request.POST.get('passwd')

    user = authenticate(username=username, password=passwd)

    if user is not None:
        login(request, user)
        return HttpResponseRedirect(reverse('blog:home', args=()))