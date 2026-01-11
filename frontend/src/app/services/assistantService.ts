import api from './api';

export const assistantService = {
  chat: async (message: string): Promise<string> => {
    const res = await api.post('/assistant/chat', { message });
    return res.data?.reply;
  },
  status: async (): Promise<{ configured: boolean; message: string }> => {
    const res = await api.get('/assistant/status');
    return res.data;
  },
};
