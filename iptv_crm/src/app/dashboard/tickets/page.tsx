'use client';

import { useState, useEffect, JSX } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

// --- Interfaces pour la structure de l'API Django ---
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Client {
    id: number;
    user: User;
    telephone: string;
    date_creation: string;
}

interface Message {
    id: number;
    auteur: User;
    message: string;
    date_envoi: string;
}

interface Ticket {
  id: number;
  client: Client;
  sujet: string;
  date_creation: string;
  statut: 'ouvert' | 'fermé' | 'en_cours';
  messages: Message[];
}

// --- Composant `TicketsTable` ---
function TicketsTable({ items, onRowClick }: { items: Ticket[]; onRowClick: (ticket: Ticket) => void; }): JSX.Element {
  const statusColors: Record<Ticket['statut'], 'success' | 'warning' | 'error'> = {
    fermé: 'success',
    en_cours: 'warning',
    ouvert: 'error',
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Sujet</TableCell>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Date de création</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <TableRow 
              key={row.id} 
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { cursor: 'pointer', backgroundColor: '#f5f5f5' } }}
              onClick={() => onRowClick(row)}
            >
              <TableCell component="th" scope="row">{row.id}</TableCell>
              <TableCell>{row.sujet}</TableCell>
              <TableCell>{row.client.user.username}</TableCell>
              <TableCell>
                <Chip label={row.statut} color={statusColors[row.statut]} size="small" sx={{ textTransform: 'capitalize' }}/>
              </TableCell>
              <TableCell>{new Date(row.date_creation).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// --- Composant `Page` principal ---
export default function Page(): JSX.Element {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const getAuthHeaders = () => {
    if (typeof window === 'undefined') {
        return { 'Content-Type': 'application/json' };
    }
    
    // Votre code dans `iptv_crm/src/lib/api.ts` utilise 'access_token'.
    const accessToken = localStorage.getItem('access_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      console.warn("Aucun token d'accès trouvé dans le localStorage avec la clé 'access_token'.");
    }
    return headers;
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://127.0.0.1:8000/api/tickets/', { headers });
      
      if (response.status === 401) {
          throw new Error("Erreur d'authentification (401). Le token est invalide, expiré ou manquant.");
      }
      if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data: Ticket[] = await response.json();
      setTickets(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des tickets:", err);
      setError(err.message || "Impossible de charger les tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
        fetchTickets();
    }
  }, []);

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyMessage('');
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  const handleCloseTicket = async (ticketId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tickets/${ticketId}/close/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('La mise à jour a échoué');
      
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, statut: 'fermé' } : t));
      handleCloseModal();
    } catch (err) {
      console.error("Erreur lors de la clôture du ticket:", err);
    }
  };
  
  const handleReplyTicket = async (ticketId: number, messageContent: string) => {
    if (!messageContent.trim()) return;

    try {
        const headers = getAuthHeaders();
        const response = await fetch(`http://127.0.0.1:8000/api/tickets/${ticketId}/reply/`, { 
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ message: messageContent }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(errorData.detail || "L'envoi du message a échoué");
        }
        
        // CORRECTION : L'API renvoie le ticket complet mis à jour.
        // On l'utilise pour mettre à jour l'état.
        const updatedTicketFromServer = await response.json();

        // Mettre à jour l'état local avec les données fraîches du serveur
        setSelectedTicket(updatedTicketFromServer);
        setTickets(tickets.map(t => t.id === ticketId ? updatedTicketFromServer : t));
        setReplyMessage('');
    } catch (err) {
        console.error("Erreur lors de l'envoi de la réponse:", err);
        // Optionnel : Afficher une alerte à l'utilisateur
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}><CircularProgress /></Box>;
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    if (tickets.length === 0 && !loading) {
        return <Alert severity="info">Aucun ticket trouvé.</Alert>;
    }
    return <TicketsTable items={tickets} onRowClick={handleOpenTicket} />;
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4">Tickets de Support</Typography>
      {renderContent()}

      {selectedTicket && (
        <Dialog open={true} onClose={handleCloseModal} fullWidth maxWidth="md">
          <DialogTitle>Ticket #{selectedTicket.id} - {selectedTicket.sujet}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle2" gutterBottom>
              De : {selectedTicket.client.user.username} ({selectedTicket.client.user.email})
            </Typography>
            
            <Box sx={{ maxHeight: 300, overflow: 'auto', my: 2, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
              {selectedTicket.messages.length > 0 ? (
                selectedTicket.messages.map((msg) => (
                  <Paper key={msg.id} elevation={2} sx={{ p: 1.5, mb: 1.5, bgcolor: msg.auteur.id === selectedTicket.client.user.id ? '#e3f2fd' : '#f1f8e9' }}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      <strong>{msg.auteur.username}</strong> le {new Date(msg.date_envoi).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.message}</Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">Aucun message dans cette conversation.</Typography>
              )}
            </Box>

            <TextField
              autoFocus
              margin="dense"
              id="message"
              label="Votre réponse"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              disabled={selectedTicket.statut === 'fermé'}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Annuler</Button>
            <Button onClick={() => handleCloseTicket(selectedTicket.id)} color="error" disabled={selectedTicket.statut === 'fermé'}>
              Clôturer le ticket
            </Button>
            <Button onClick={() => handleReplyTicket(selectedTicket.id, replyMessage)} variant="contained" disabled={!replyMessage.trim() || selectedTicket.statut === 'fermé'}>
              Envoyer la réponse
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
}
