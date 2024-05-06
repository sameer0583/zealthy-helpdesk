import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Ticket-related API calls
export const TicketAPI = {
  create: async (name: string, email: string, description: string) => {
    const response = await apiClient.post('/tickets', { name, email, description });
    return response.data;
  },

  fetchAll: async () => {
    const response = await apiClient.get('/tickets');
    return response.data;
  },

  fetchById: async (ticketId: number) => {
    const response = await apiClient.get(`/tickets/${ticketId}`);
    return response.data;
  },

  updateStatus: async (ticketId: number, status: 'new' | 'in_progress' | 'resolved') => {
    const response = await apiClient.patch(`/tickets/${ticketId}/status`, { status });
    return response.data;
  },

  addResponse: async (ticketId: number, userId: number, description: string) => {
    const response = await apiClient.post(`/tickets/${ticketId}/responses`, { userId, description });
    return response.data;
  },
};

// User-related API calls
export interface User {
  id: number;
  name: string;
  email: string;
}

let currentUser: User | null = null;

export const UserAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: () => {
    return currentUser;
  }
};

export default apiClient;