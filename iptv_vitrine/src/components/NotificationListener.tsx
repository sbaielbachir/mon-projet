'use client';

import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useWebSocket } from '@/hooks/use-websocket';

export default function NotificationListener() {
    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            toast(data.message || event.data);
        } catch (err) {
            console.error('Invalid notification message', err);
        }
    }, []);

    useWebSocket('/ws/user/notifications/', { onMessage: handleMessage });

    return null;