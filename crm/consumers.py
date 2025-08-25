import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import TicketSupport, MessageTicket
from .serializers import MessageTicketSerializer
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs

@database_sync_to_async
def get_user_from_token(token_str):
    try:
        token = AccessToken(token_str)
        user_id = token['user_id']
        return User.objects.get(id=user_id)
    except Exception:
        return None

@database_sync_to_async
def get_ticket(ticket_id, user):
    try:
        ticket = TicketSupport.objects.get(id=ticket_id)
        # Autorisation : L'utilisateur doit être le client du ticket ou un admin
        if user.is_staff or ticket.client.user == user:
            return ticket
        return None
    except TicketSupport.DoesNotExist:
        return None

@database_sync_to_async
def save_message(ticket, user, message_text):
    message = MessageTicket.objects.create(
        ticket=ticket,
        auteur=user,
        message=message_text
    )
    # Mettre à jour le statut du ticket si un client répond
    if not user.is_staff and ticket.statut == 'ferme':
        ticket.statut = 'en_cours'
        ticket.save()
    return message

class TicketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.ticket_id = self.scope['url_route']['kwargs']['ticket_id']
        self.ticket_group_name = f'ticket_{self.ticket_id}'

        # Extraire le token des paramètres de la requête
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if not token:
            await self.close()
            return

        self.scope['user'] = await get_user_from_token(token)
        
        if not self.scope['user']:
            await self.close()
            return

        self.ticket = await get_ticket(self.ticket_id, self.scope['user'])

        if not self.ticket:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.ticket_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.ticket_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data['message']
        user = self.scope['user']

        new_message = await save_message(self.ticket, user, message_text)
        
        serializer = MessageTicketSerializer(new_message)
        message_data = serializer.data

        await self.channel_layer.group_send(
            self.ticket_group_name,
            {
                'type': 'chat_message',
                'message': message_data
            }
        )

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message
        }))


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if not token:
            await self.close()
            return

        user = await get_user_from_token(token)
        if not user or not user.is_staff:
            await self.close()
            return

        self.scope['user'] = user

        await self.channel_layer.group_add(
            'admin_notifications',
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            'admin_notifications',
            self.channel_name
        )

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event['notification']))



class UserNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if not token:
            await self.close()
            return

        user = await get_user_from_token(token)
        if not user:
            await self.close()
            return

        self.scope['user'] = user
        self.group_name = f'user_{user.id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event['notification']))