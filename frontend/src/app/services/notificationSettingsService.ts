import api from './api';

export const notificationSettingsService = {
  getSettings: async () => {
    try {
      const resp = await api.get('/notifications/settings');
      return resp.data as { pushNotificationsEnabled: boolean; emailUpdatesEnabled: boolean };
    } catch (err) {
      console.warn('Failed to fetch notification settings', err);
      return { pushNotificationsEnabled: false, emailUpdatesEnabled: false };
    }
  },

  updateSettings: async (payload: { pushNotificationsEnabled?: boolean; emailUpdatesEnabled?: boolean }) => {
    try {
      const resp = await api.put('/notifications/settings', payload);
      return resp.data as { pushNotificationsEnabled: boolean; emailUpdatesEnabled: boolean };
    } catch (err) {
      console.warn('Failed to update notification settings', err);
      throw err;
    }
  }
};

export default notificationSettingsService;
