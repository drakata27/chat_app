import json

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST

from account.forms import AddUserForm, EditUserForm
from account.models import User

from .models import Room

@require_POST
def create_room(request, room_id):
    name = request.POST.get('name', '')
    url = request.POST.get('url', '')

    print('name', name)
    print('url', url)

    Room.objects.create(room_id=room_id, client=name, url=url)

    return JsonResponse({
        'message': 'room was created'
    })

@login_required
def admin(request):
    rooms = Room.objects.all()
    users = User.objects.filter(is_staff=True)

    context = {
        'rooms': rooms,
        'users': users,
    }

    return render(request, 'chat/admin.html', context=context)

@login_required
def room(request, room_id):
    room = Room.objects.get(room_id=room_id)

    if room.status == Room.WAITING:
        room.status = Room.ACTIVE
        room.agent = request.user
        room.save()

    context= {'room': room,}
    return render(request, 'chat/room.html', context=context)

@login_required
def delete_room(request, room_id):
    if request.user.has_perm('room.delete_room'):
        room = Room.objects.get(room_id=room_id)
        room.delete()

        messages.success(request,'Room deleted successfully!')
        return redirect('/chat-admin/')
    else:
        messages.error(request, 'You do not have access to delete rooms!')
        return redirect('/chat-admin/')

@login_required
def user_detail(request, id):
    user = User.objects.get(pk=id)
    rooms = user.rooms.all()

    context = { 
        'user':user, 
        'rooms': rooms,
    }

    return render(request, 'chat/user_detail.html', context=context)

@login_required
def edit_user(request, id):
    if request.user.has_perm('user.edit_user'):
        user = User.objects.get(pk=id)

        if request.method == 'POST':
            form = EditUserForm(request.POST, instance=user)

            if form.is_valid():
                form.save()
                messages.success(request, 'User was edited successfully!')
                return redirect('/chat-admin/')
        else:
            form = EditUserForm(instance=user)

        context = { 
            'user':user, 
            'form': form,
        }
        return render(request, 'chat/edit_user.html', context=context)
    else:
        messages.error(request, 'You do not have permition to edit users!')
        return redirect('/chat-admin/')
    
@login_required
def add_user(request):
    if request.user.has_perm('user.add_user'):
        if request.method == 'POST':
            form = AddUserForm(request.POST)

            if form.is_valid():
                user = form.save(commit=False)
                user.is_staff = True
                user.set_password(request.POST.get('password'))
                user.save()

                if user.role == User.MANAGER:
                    group = Group.objects.get(name="Managers")
                    group.user_set.add(user)

                if user.role == User.AGENT:
                    group = Group.objects.get(name="Agents")
                    group.user_set.add(user)
                
                messages.success(request, 'User was added successfully!')
                return redirect('/chat-admin/')
                    
        else:
            form = AddUserForm()

        context =  { 'form':form, }     
        return render(request, 'chat/add_user.html', context=context)
    else:
        messages.error(request, 'You do not have permition to add users!')
        return redirect('/chat-admin/')