'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getClientTickets, createTicket, getTicketDetails, replyToTicket } from '@/lib/api';
import { Loader2, MessageSquare, Plus, X, CheckCircle, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

// --- MODAL POUR CRÉER UN NOUVEAU TICKET ---
const NewTicketModal = ({ open, onClose, onTicketCreated }: { open: boolean, onClose: () => void, onTicketCreated: () => void }) => {
    const { token } = useAuth();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setLoading(true);
        setError('');
        try {
            await createTicket(token, subject, message);
            toast.success('Ticket créé avec succès !');
            onTicketCreated();
            onClose();
            setSubject('');
            setMessage('');
        } catch (err: any) {
            setError(err.message || 'La création du ticket a échoué.');
            toast.error('La création du ticket a échoué.');
        } finally {
            setLoading(false);
        }
    };
    
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card border border-border rounded-lg shadow-xl p-6 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-white"><X size={20} /></button>
                <h3 className="text-xl font-bold text-center mb-4">Nouveau Ticket de Support</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm text-text-muted mb-1">Sujet</label>
                        <input id="subject" type="text" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm text-text-muted mb-1">Message</label>
                        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={5} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center">
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Créer le Ticket
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- MODAL POUR AFFICHER LE CHAT D'UN TICKET ---
const TicketDetailModal = ({ ticketId, onClose, clientUserId }: { ticketId: number, onClose: () => void, clientUserId: number }) => {
    const { token } = useAuth();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchDetails = useCallback(async () => {
        if (token) {
            try {
                const data = await getTicketDetails(token, ticketId);
                setTicket(data);
            } catch (error) {
                console.error("Failed to fetch ticket details", error);
                toast.error("Impossible de charger les détails du ticket.");
            } finally {
                setLoading(false);
            }
        }
    }, [token, ticketId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);
    
    useEffect(() => {
        scrollToBottom();
    }, [ticket?.messages]);

    useEffect(() => {
        if (!token) return;
        const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
        const wsBase = apiBase.replace(/^http/, 'ws');
        const socket = new WebSocket(`${wsBase}/ws/tickets/${ticketId}/?token=${token}`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chat_message') {
                setTicket((prevTicket: any) => {
                    if (prevTicket.messages.some((m: any) => m.id === data.message.id)) {
                        return prevTicket;
                    }
                    return {
                        ...prevTicket,
                        messages: [...prevTicket.messages, data.message]
                    };
                });
                if(data.message.auteur.id !== clientUserId) {
                    toast.success("Nouveau message de l'administrateur !");
                }
            }
        };

        socket.onclose = () => console.warn('WebSocket disconnected');
        socket.onerror = (err) => console.error('WebSocket error:', err);

        return () => socket.close();
    }, [ticketId, token, clientUserId]);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !reply.trim()) return;
        setSending(true);
        try {
            const updatedTicket = await replyToTicket(token, ticketId, reply);
            setTicket(updatedTicket);
            setReply('');
        } catch (error) {
            toast.error("L'envoi du message a échoué.");
        } finally {
            setSending(false);
        }
    };

    return (
         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-border flex justify-between items-center flex-shrink-0">
                    <h3 className="text-lg font-bold">Ticket #{ticket?.id} - {ticket?.sujet}</h3>
                    <button onClick={onClose} className="text-text-muted hover:text-white"><X size={20} /></button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-background">
                    {loading ? <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div> :
                        ticket?.messages.map((msg: any) => (
                            <div key={msg.id} className={`flex ${msg.auteur.id === clientUserId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md p-3 rounded-lg ${msg.auteur.id === clientUserId ? 'bg-primary text-white' : 'bg-card border border-border'}`}>
                                    <p className="text-sm">{msg.message}</p>
                                    <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.date_envoi).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>
                        ))
                    }
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-border flex-shrink-0">
                    <form onSubmit={handleReply} className="flex gap-2">
                        <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Écrivez votre réponse..." className="w-full bg-background border border-border rounded-md p-2" />
                        <button type="submit" disabled={sending} className="btn-primary flex items-center justify-center px-4">
                            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send size={18} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
export default function SupportTicketsPage({ clientName }: { clientName: string }) {
    const { token, user } = useAuth();
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

    const fetchTickets = useCallback(async () => {
        if (token) {
            try {
                setIsLoading(true);
                const data = await getClientTickets(token);
                setTickets(data);
            } catch (error) {
                console.error("Failed to fetch tickets", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [token]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'ouvert':
                return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 text-xs rounded-full flex items-center gap-1"><Clock size={14} /> Ouvert</span>;
            case 'en_cours':
                return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 text-xs rounded-full flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> En cours</span>;
            case 'ferme':
                return <span className="bg-green-500/20 text-green-400 px-2 py-1 text-xs rounded-full flex items-center gap-1"><CheckCircle size={14} /> Fermé</span>;
            default:
                return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 text-xs rounded-full">{status}</span>;
        }
    };
    
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'Date invalide';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Date invalide' : date.toLocaleDateString('fr-FR');
    };

    return (
        <>
            <NewTicketModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onTicketCreated={fetchTickets} />
            {selectedTicketId && user && <TicketDetailModal ticketId={selectedTicketId} onClose={() => setSelectedTicketId(null)} clientUserId={user.id} />}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Mes Tickets de Support</h1>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus size={16} />
                        Nouveau Ticket
                    </button>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                    {isLoading ? (
                         <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : tickets.length > 0 ? (
                        <div className="space-y-4">
                            {tickets.map(ticket => (
                                <button key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className="w-full text-left bg-background p-4 rounded-lg border border-border flex justify-between items-center hover:border-primary transition-colors">
                                    <div>
                                        <h3 className="font-bold text-lg">{ticket.sujet}</h3>
                                        <p className="text-sm text-text-muted mt-1">
                                            Ticket #{ticket.id} - Dernière mise à jour: {formatDate(ticket.date_mise_a_jour ?? ticket.date_creation ?? ticket.messages.at(-1)?.date_envoi)}
                                        </p>
                                    </div>
                                    {getStatusChip(ticket.statut)}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-text-muted py-8">
                            <MessageSquare size={48} className="mx-auto mb-4" />
                            <h3 className="text-xl font-semibold">Aucun ticket trouvé</h3>
                            <p>Cliquez sur "Nouveau Ticket" pour soumettre une demande.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}