import api from './api';

export interface FaqItem {
  question: string;
  answer: string;
  keywords: string[];
}

export const helpService = {
  async faqs(): Promise<FaqItem[]> {
    const resp = await api.get('/help/faq');
    return resp.data || [];
  },
  async ask(message: string): Promise<string> {
    const resp = await api.post('/help/ask', { message });
    return resp.data?.reply || '';
  }
};
