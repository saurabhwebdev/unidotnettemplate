import { api } from './api';

export interface EmailAlertType {
  value: number;
  name: string;
  displayName: string;
  description: string;
}

export interface EmailPreference {
  id: string;
  alertType: number;
  alertTypeName: string;
  displayName: string;
  isEnabled: boolean;
}

export const emailPreferencesService = {
  async getAlertTypes(): Promise<EmailAlertType[]> {
    const response = await api.get('/emailpreferences/alert-types');
    return response.data;
  },

  async getPreferences(): Promise<EmailPreference[]> {
    const response = await api.get('/emailpreferences');
    return response.data;
  },

  async updatePreference(alertType: number, isEnabled: boolean): Promise<EmailPreference> {
    const response = await api.post('/emailpreferences', { alertType, isEnabled });
    return response.data;
  },

  async updatePreferences(preferences: { alertType: number; isEnabled: boolean }[]): Promise<void> {
    await api.post('/emailpreferences/batch', preferences);
  }
};
