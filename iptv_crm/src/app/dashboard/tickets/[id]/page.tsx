'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Stack, TextField, Typography, CircularProgress, Paper, Avatar } from '@mui/material';
import { api } from '@/lib/api';
import dayjs from 'dayjs';

import { useWebSocket } from '@/hooks/use-websocket';

export default function Page({ params }: { params: { id: string } }): React.JSX.Element {
  const [ticket, setTicket] = useState<any>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchTicket = useCallback(async () => {
    try {
      const response = await api.get(`/tickets/${params.id}/`);
      setTicket(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du ticket:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

   const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    if (data.type === 'chat_message') {
      const newMessage = data.message;
      setTicket((prev) => {
        if (prev && !prev.messages.some((m: any) => m.id === newMessage.id)) {
          return { ...prev, messages: [...prev.messages, newMessage] };
        }
          return prev;
        });
      }
  }, []);

    useWebSocket(`/ws/tickets/${params.id}/`, { onMessage: handleWebSocketMessage });
  
  useEffect(() => {
    scrollToBottom();
  }, [ticket?.messages]);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setIsReplying(true);
    try {
      // L'API renvoie le ticket mis à jour avec le nouveau message
      const response = await api.post(`/tickets/${params.id}/reply/`, { message: reply });
      // On met à jour l'état local directement avec la réponse
      setTicket(response.data);
      setReply('');
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    } finally {
      setIsReplying(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
  if (!ticket) return <Typography>Ticket non trouvé.</Typography>;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Ticket #{ticket.id} - {ticket.sujet}</Typography>
      <Card>
        <CardHeader title="Conversation" />
        <Divider />
        <CardContent sx={{ maxHeight: '500px', overflowY: 'auto', p: 2 }}>
          <Stack spacing={2}>
            {ticket.messages.map((message: any) => (
              <Box key={message.id} sx={{ display: 'flex', flexDirection: message.auteur.is_staff ? 'row-reverse' : 'row', gap: 2, alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: message.auteur.is_staff ? 'primary.main' : 'secondary.main' }}>
                      {message.auteur.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2, bgcolor: message.auteur.is_staff ? 'primary.light' : 'grey.200', maxWidth: '80%' }}>
                      <Typography variant="subtitle2">
                          {message.auteur.is_staff ? 'Support' : ticket.client?.user?.username || 'Client'}
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: message.auteur.is_staff ? 'primary.contrastText' : 'text.primary' }}>
                          {message.message}
                      </Typography>
                      <Typography variant="caption" color={message.auteur.is_staff ? 'grey.300' : 'text.secondary'} sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
                          {dayjs(message.date_envoi).format('DD/MM/YYYY HH:mm')}
                      </Typography>
                  </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Répondre au ticket" />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Votre message"
            multiline
            rows={4}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            disabled={isReplying}
          />
        </CardContent>
        <Divider />
        <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
          <Button variant="contained" onClick={handleReply} disabled={isReplying}>
            {isReplying ? <CircularProgress size={24} /> : 'Envoyer'}
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}