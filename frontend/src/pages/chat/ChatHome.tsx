import React, { useState, useEffect, useRef } from 'react';
import { chatApi, Conversation, Message } from '../../api/chatApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Send, Mic, MoreVertical, Search, User, Users } from 'lucide-react';

export const ChatHome = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  
  // Simulated logged-in user
  const currentUserId = '55555555-5555-5555-5555-555555555555';
  
  // Custom hook handles STOMP subscription and appends real-time messages
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
    // Auto-scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      // Create a mock direct conversation if there are none (just for testing flow without DB population)
      let convs = await chatApi.getUserConversations(currentUserId);
      if (convs.length === 0) {
        const mockTargetId = '66666666-6666-6666-6666-666666666666';
        await chatApi.createDirectConversation(currentUserId, mockTargetId);
        convs = await chatApi.getUserConversations(currentUserId);
      }
      setConversations(convs);
      if (convs.length > 0) setActiveConversation(convs[0]);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const loadHistory = async (conversationId: string) => {
    try {
      const history = await chatApi.getConversationHistory(conversationId);
      setInitialMessages(history);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    sendMessage(currentUserId, messageInput.trim());
    setMessageInput('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-slate-900 text-slate-100 overflow-hidden">
      
      {/* Sidebar: Conversation List */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-950 shrink-0">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold mb-4">Mensajes</h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar chats..." 
              className="w-full bg-slate-900 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-800"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-grow">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setActiveConversation(conv)}
              className={`p-4 border-b border-slate-800/50 cursor-pointer transition-colors flex items-center gap-3 ${
                activeConversation?.id === conv.id ? 'bg-slate-800' : 'hover:bg-slate-900'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                {conv.type === 'DIRECT' ? <User className="w-6 h-6 text-white" /> : <Users className="w-6 h-6 text-white" />}
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-semibold truncate">{conv.name || 'Chat ' + conv.type}</h3>
                <p className="text-xs text-slate-500 truncate">Haz clic para ver mensajes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area: Active Chat */}
      <div className="flex-grow flex flex-col bg-slate-900 relative">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <header className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  {activeConversation.type === 'DIRECT' ? <User className="w-5 h-5 text-slate-400" /> : <Users className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <h3 className="font-bold">{activeConversation.name || 'Chat ' + activeConversation.type}</h3>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> 
                    {connected ? 'Conectado (STOMP)' : 'Conectando...'}
                  </p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white p-2">
                <MoreVertical className="w-5 h-5" />
              </button>
            </header>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id || idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-tr-sm' 
                          : 'bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700'
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Ahora'}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
              <form onSubmit={handleSend} className="flex items-end gap-2 max-w-4xl mx-auto">
                <button type="button" className="p-3 text-slate-400 hover:text-blue-400 transition-colors bg-slate-900 rounded-full">
                  <Mic className="w-5 h-5" />
                </button>
                <div className="flex-grow bg-slate-900 border border-slate-800 rounded-2xl flex items-center">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="w-full bg-transparent px-4 py-3 focus:outline-none text-white"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!messageInput.trim() || !connected}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-500">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-slate-400">Tus Mensajes</h2>
            <p>Selecciona una conversación para empezar a chatear</p>
          </div>
        )}
      </div>
    </div>
  );
};
