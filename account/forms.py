from django import forms
from django.contrib.auth.forms import AuthenticationForm

from .models import User

class LoginForm(AuthenticationForm):
    class Meta:
        model = User
        fields = ('username', 'password',)

class AddUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'name', 'role', 'password',)

class EditUserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'name', 'role',)