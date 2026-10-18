import { apiClient } from './apiClient';

export interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
  name: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export const chatApi = {
  createDirectConversation: async (user1: string, user2: string): Promise<Conversation> => {
    const response = await apiClient.post('/chat/conversations', { user1, user2 });
    return response.data;
  },

  getUserConversations: async (userId: string): Promise<Conversation[]> => {
    const response = await apiClient.get(`/chat/users/${userId}/conversations`);
    return response.data;
  },

  getConversationHistory: async (conversationId: string): Promise<Message[]> => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
    return response.data;
  }
};
