import { api } from './api';

export interface HelpTopic {
  id: string;
  question: string;
  answer: string;
  order: number;
  helpSectionId: string;
  createdAt: string;
}

export interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isEnabled: boolean;
  topics: HelpTopic[];
  createdAt: string;
}

export interface CreateHelpSectionRequest {
  title: string;
  description: string;
  icon: string;
  order: number;
  isEnabled: boolean;
}

export interface UpdateHelpSectionRequest {
  title: string;
  description: string;
  icon: string;
  order: number;
  isEnabled: boolean;
}

export interface CreateHelpTopicRequest {
  question: string;
  answer: string;
  order: number;
  helpSectionId: string;
}

export interface UpdateHelpTopicRequest {
  question: string;
  answer: string;
  order: number;
}

class HelpService {
  async getAllSections(): Promise<HelpSection[]> {
    const response = await api.get<HelpSection[]>('/help/sections');
    return response.data;
  }

  async getEnabledSections(): Promise<HelpSection[]> {
    const response = await api.get<HelpSection[]>('/help/sections/enabled');
    return response.data;
  }

  async getSectionById(id: string): Promise<HelpSection> {
    const response = await api.get<HelpSection>(`/help/sections/${id}`);
    return response.data;
  }

  async createSection(data: CreateHelpSectionRequest): Promise<HelpSection> {
    const response = await api.post<HelpSection>('/help/sections', data);
    return response.data;
  }

  async updateSection(id: string, data: UpdateHelpSectionRequest): Promise<HelpSection> {
    const response = await api.put<HelpSection>(`/help/sections/${id}`, data);
    return response.data;
  }

  async deleteSection(id: string): Promise<void> {
    await api.delete(`/help/sections/${id}`);
  }

  async getTopicById(id: string): Promise<HelpTopic> {
    const response = await api.get<HelpTopic>(`/help/topics/${id}`);
    return response.data;
  }

  async createTopic(data: CreateHelpTopicRequest): Promise<HelpTopic> {
    const response = await api.post<HelpTopic>('/help/topics', data);
    return response.data;
  }

  async updateTopic(id: string, data: UpdateHelpTopicRequest): Promise<HelpTopic> {
    const response = await api.put<HelpTopic>(`/help/topics/${id}`, data);
    return response.data;
  }

  async deleteTopic(id: string): Promise<void> {
    await api.delete(`/help/topics/${id}`);
  }
}

export const helpService = new HelpService();
