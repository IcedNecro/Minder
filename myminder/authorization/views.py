from django.shortcuts import render

from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
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

def render_home_form(request):
    template = loader.get_template('templates/home.html')
    context = RequestContext(request, {
        'user': request.user.username
    })

    return HttpResponse(template.render(context))

def retrieve_registration_form(request):
    login = request.POST.get('login')
    email = request.POST.get('email')
    passwd = request.POST.get('passwd')

    user = User.objects.create_user(login, email, passwd)
    return HttpResponseRedirect(reverse('auth:login', args=()))

def retrieve_login_form(request):
    username = request.POST.get('login')
    passwd = request.POST.get('passwd')

    user = authenticate(username=username, password=passwd)
    import ipdb; ipdb.set_trace()
    if user is not None:
        login(request, user)
        return HttpResponseRedirect(reverse('auth:home', args=()))