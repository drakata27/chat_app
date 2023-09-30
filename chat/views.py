import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

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