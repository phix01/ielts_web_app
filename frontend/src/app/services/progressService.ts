import api from './api';

export const progressService = {
  complete: async (contentType: 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING') => {
    try {
      await api.post('/progress/complete', { contentType });
      // notify app that progress changed
      window.dispatchEvent(new CustomEvent('progress:changed'));
    } catch (err) {
      // non-blocking: log and continue
      console.warn('Failed to report progress', err);
    }
  },

  summary: async () => {
    try {
      const resp = await api.get<Record<string, number>>('/progress/summary');
      return resp.data;
    } catch (err) {
      console.warn('Failed to fetch progress summary', err);
      return { READING: 0, LISTENING: 0, WRITING: 0, SPEAKING: 0 };
    }
  }
  ,
  dashboardStats: async () => {
    try {
      const resp = await api.get('/progress/dashboard-stats');
      return resp.data as { completedExercises: number; practiceTimeHours: number; vocabularyWords: number; testsCompleted: number };
    } catch (err) {
      console.warn('Failed to fetch dashboard stats', err);
      return { completedExercises: 0, practiceTimeHours: 0, vocabularyWords: 0, testsCompleted: 0 };
    }
  }
};

export default progressService;
