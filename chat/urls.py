from django.urls import path

from . import views

app_name = 'chat'

urlpatterns = [
    path('api/create-room/<str:room_id>/', views.create_room, name='create-room'),
    path('chat-admin/', views.admin, name='admin'),
    path('chat-admin/<str:room_id>/', views.room, name='room'),
]