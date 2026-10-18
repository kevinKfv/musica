import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../api/chatApi';

export const useWebSocket = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    // Reset messages when conversation changes
    setMessages([]);

    const client = new Client({
      // We assume backend is running on 8080 and API routes are proxied, 
      // but for sockjs it's better to provide full URL if not proxied, 
      // or just /ws if proxied. Let's use standard full URL for safety in dev.
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        console.log('STOMP Connected to conversation:', conversationId);
        
        client.subscribe(`/topic/conversations/${conversationId}`, (message: IMessage) => {
          const parsedMessage: Message = JSON.parse(message.body);
          setMessages(prev => {
            // Avoid duplicates just in case
            if (prev.some(m => m.id === parsedMessage.id)) return prev;
            return [...prev, parsedMessage];
          });
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      },
      onDisconnect: () => {
        setConnected(false);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [conversationId]);

  const sendMessage = useCallback((senderId: string, content: string) => {
    if (clientRef.current && clientRef.current.connected && conversationId) {
      clientRef.current.publish({
        destination: `/app/chat/${conversationId}/send`,
        body: JSON.stringify({ senderId, content })
      });
    } else {
      console.error('STOMP client not connected');
    }
  }, [conversationId]);

  const setInitialMessages = useCallback((history: Message[]) => {
    setMessages(history);
  }, []);

  return { messages, connected, sendMessage, setInitialMessages };
};
