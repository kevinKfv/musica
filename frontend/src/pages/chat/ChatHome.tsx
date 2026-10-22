import React, { useState, useEffect, useRef } from 'react';
import { chatApi, Conversation, Message } from '../../api/chatApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Send, Search, User, Users, MessageSquare, Plus, CheckCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    type: 'GROUP',
    name: '🎸 Ensayos & Banda Principal',
    createdAt: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    type: 'DIRECT',
    name: 'Juan Músico (Guitarrista)',
    createdAt: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    type: 'DIRECT',
    name: 'María (Voz & Teclados)',
    createdAt: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    type: 'DIRECT',
    name: 'Estudio El Pie (Mastering)',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_MESSAGES_MAP: Record<string, Message[]> = {
  '11111111-1111-1111-1111-111111111111': [
    {
      id: 'm1',
      conversationId: '11111111-1111-1111-1111-111111111111',
      senderId: 'other-user-1',
      content: '¡Buenas a todos! ¿Confirmamos el ensayo para este sábado a las 17hs en La Cueva?',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'm2',
      conversationId: '11111111-1111-1111-1111-111111111111',
      senderId: 'other-user-2',
      content: 'De acuerdo. Ya repasé los acordes de "De Música Ligera" de la biblioteca.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  '22222222-2222-2222-2222-222222222222': [
    {
      id: 'm3',
      conversationId: '22222222-2222-2222-2222-222222222222',
      senderId: '22222222-2222-2222-2222-222222222222',
      content: '¡Hola! ¿Viste la pista nueva que subí al estudio virtual?',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
};

export const ChatHome = () => {
  const [conversations, setConversations] = useState<Conversation[]>(DEFAULT_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<Conversation>(DEFAULT_CONVERSATIONS[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const currentUserId = '55555555-5555-5555-5555-555555555555';
  const { messages, connected, sendMessage, setInitialMessages } = useWebSocket(activeConversation?.id || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadHistory(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const convs = await chatApi.getUserConversations(currentUserId);
      if (convs && convs.length > 0) {
        setConversations(convs);
        setActiveConversation(convs[0]);
      } else {
        setConversations(DEFAULT_CONVERSATIONS);
        setActiveConversation(DEFAULT_CONVERSATIONS[0]);
      }
    } catch {
      // Fallback seamlessly to default chat channels
      setConversations(DEFAULT_CONVERSATIONS);
      setActiveConversation(DEFAULT_CONVERSATIONS[0]);
    }
  };

  const loadHistory = async (conversationId: string) => {
    try {
      const history = await chatApi.getConversationHistory(conversationId);
      if (history && history.length > 0) {
        setInitialMessages(history);
      } else {
        setInitialMessages(INITIAL_MESSAGES_MAP[conversationId] || []);
      }
    } catch {
      setInitialMessages(INITIAL_MESSAGES_MAP[conversationId] || []);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const content = messageInput.trim();
    setMessageInput('');

    // Optimistic local update
    const newMsg: Message = {
      id: Date.now().toString(),
      conversationId: activeConversation.id,
      senderId: currentUserId,
      content,
      createdAt: new Date().toISOString(),
    };
    setInitialMessages((prev) => [...prev, newMsg]);

    // Send through WebSocket / API
    sendMessage(currentUserId, content);
  };

  const handleCreateNewChat = () => {
    const name = window.prompt('Nombre del nuevo contacto o grupo:');
    if (!name || !name.trim()) return;

    const newConv: Conversation = {
      id: `chat-${Date.now()}`,
      type: name.includes('&') || name.includes('Banda') ? 'GROUP' : 'DIRECT',
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversation(newConv);
  };

  const filteredConversations = conversations.filter((c) =>
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        height: 'calc(100vh - 120px)',
        minHeight: '520px',
        display: 'flex',
        borderRadius: '1.25rem',
        border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
        background: 'var(--bh-bg-surface, #12121a)',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Sidebar: Conversation List */}
      <div
        style={{
          width: '320px',
          borderRight: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(10, 10, 15, 0.5)',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} style={{ color: 'var(--bh-primary, #6366f1)' }} />
              <h2
                style={{
                  fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Mensajería
              </h2>
            </div>
            <button
              onClick={handleCreateNewChat}
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                color: '#a5b4fc',
                padding: '4px 8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Iniciar nuevo chat"
            >
              <Plus size={14} /> Nuevo
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#71717a',
              }}
            />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem' }}>
          {filteredConversations.map((conv) => {
            const isSelected = activeConversation?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: '0.75rem',
                  marginBottom: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: isSelected ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: conv.type === 'GROUP'
                      ? 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)'
                      : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {conv.type === 'DIRECT' ? <User size={18} /> : <Users size={18} />}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f4f4f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.name || 'Conversación'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: isSelected ? '#a5b4fc' : '#71717a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.type === 'GROUP' ? 'Grupo musical' : 'Chat directo'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Area: Active Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
        {/* Chat Header */}
        <header
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--bh-primary, #6366f1) 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              {activeConversation.type === 'GROUP' ? <Users size={18} /> : <User size={18} />}
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                }}
              >
                {activeConversation.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: connected ? '#10b981' : '#a1a1aa' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: connected ? '#10b981' : '#6366f1',
                    display: 'inline-block',
                  }}
                />
                {connected ? 'Conectado en tiempo real' : 'Canal activo'}
              </div>
            </div>
          </div>
        </header>

        {/* Message Thread */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#71717a', textAlign: 'center' }}>
              <MessageSquare size={36} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#a1a1aa' }}>No hay mensajes aún en esta conversación.</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>Escribí un mensaje abajo para iniciar el diálogo.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id || index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '0.875rem 1.15rem',
                      borderRadius: isMine ? '1.15rem 1.15rem 0.25rem 1.15rem' : '1.15rem 1.15rem 1.15rem 0.25rem',
                      background: isMine
                        ? 'linear-gradient(135deg, var(--bh-primary, #6366f1) 0%, #8b5cf6 100%)'
                        : 'rgba(255, 255, 255, 0.06)',
                      border: isMine ? 'none' : '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
                      color: '#ffffff',
                      fontSize: '0.925rem',
                      lineHeight: 1.5,
                      boxShadow: isMine ? '0 4px 16px rgba(99, 102, 241, 0.25)' : 'none',
                    }}
                  >
                    {msg.content}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.7rem', color: '#71717a' }}>
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMine && <CheckCheck size={12} color="#10b981" />}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar — Always present and functional! */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
            background: 'rgba(10, 10, 15, 0.5)',
          }}
        >
          <form
            onSubmit={handleSend}
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder={`Enviar mensaje a ${activeConversation.name}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.875rem 1.25rem',
                borderRadius: '0.75rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.1))',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--bh-primary, #6366f1)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={!messageInput.trim()}
              style={{
                padding: '0.875rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Send size={16} />
              <span>Enviar</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
