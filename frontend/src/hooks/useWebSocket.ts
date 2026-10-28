import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../api/chatApi';

const getWebSocketUrl = () => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    return apiUrl.replace(/\/api\/v1\/?$/, '') + '/ws';
  }
  return 'http://localhost:8080/ws';
};

export const useWebSocket = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    // Reset messages when conversation changes
    setMessages([]);

    const client = new Client({
      webSocketFactory: () => new SockJS(getWebSocketUrl()),
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

  const setInitialMessages = useCallback((history: Message[] | ((prev: Message[]) => Message[])) => {
    setMessages(history);
  }, []);

  return { messages, connected, sendMessage, setInitialMessages };
};
