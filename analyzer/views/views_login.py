from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect


from django import forms


class LoginForm(forms.Form):
    username = forms.CharField(label='username', max_length=32)
    password = forms.CharField(label='password', max_length=32, widget=forms.PasswordInput)


@ensure_csrf_cookie  # Add csrf cookie to the web page for future post requests.
def login_view(request):

    context = {'form': LoginForm()}

    if request.method == 'POST':

        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            context['error'] = 'Could not login'

    ##############################################
    return render(request, 'login.html', context)
    ##############################################


@login_required(login_url=settings.LOGIN_URL)
@ensure_csrf_cookie  # Add csrf cookie to the web page for future post requests.
def logout_view(request):
    logout(request)

    #################################
    return redirect(settings.LOGIN_URL)
    #################################
