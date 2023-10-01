import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timesince import timesince

from account.models import User

from .models import Room, Message
from .templatetags.chatextras import initials

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'


        # print
        print('self.room_name',  self.room_name)
        print('self.room_group_name',  self.room_group_name)

        # Join room group
        await self.get_room()
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    
    async def receive(self, text_data):
        # Receive message from websocket (front end)
        text_data_json = json.loads(text_data)
        type = text_data_json['type']
        message = text_data_json['message']
        name = text_data_json['name']
        agent = text_data_json.get('agent', '')

        # print
        print('text data json', text_data_json)
        print('type', type)
        print('message', message)
        print('name', name)
        print('agent', agent)

        if type == 'message':
            new_message = await self.create_message(name, message, agent)

            # Send message to group or room
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'chat_message',
                'message': message,
                'name': name,
                'agent': agent,
                'initials': initials(name),
                'created_at': timesince(new_message.created_at),
            })

    async def chat_message(self, event):
        print('event', event)
        # Send message to the websocket (front end)
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'message': event['message'],
            'name': event['name'],
            'agent': event['agent'],
            'initials': event['initials'],
            'created_at': event['created_at'],
        }))

    @sync_to_async
    def get_room(self):
        self.room = Room.objects.get(room_id=self.room_name)

    @sync_to_async
    def create_message(self, sent_by, message, agent):
        message = Message.objects.create(message_body=message, sent_by=sent_by)
        print('Message: ',message)
        if agent:
            message.created_by = User.objects.get(pk=agent)
            message.save()
        
        self.room.messages.add(message)

        return message