import json

from django.http import JsonResponse
from django.views.decorators.http import require_POST

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