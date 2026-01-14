import { apiClient } from '@/shared/api/client';

// About Me Types
export interface AboutMe {
  _id?: string;
  title: string;
  content: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

// Contact Types
export interface Contact {
  _id?: string;
  id: string;
  type: string;
  label: string;
  value: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

// Experience Types
export interface Experience {
  _id?: string;
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  technologies: string[];
  achievements: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Skill Types
export interface Skill {
  _id?: string;
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

// About Me API
export const aboutMeApi = {
  async getAboutMe(): Promise<AboutMe> {
    return apiClient.get<AboutMe>('/about-me');
  },

  async createAboutMe(data: Omit<AboutMe, '_id' | 'createdAt' | 'updatedAt'>): Promise<AboutMe> {
    return apiClient.post<AboutMe>('/about-me', data);
  },

  async updateAboutMe(data: Partial<AboutMe>): Promise<AboutMe> {
    return apiClient.put<AboutMe>('/about-me', data);
  },

  async deleteAboutMe(): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>('/about-me');
  },
};

// Contacts API
export const contactsApi = {
  async getContacts(): Promise<Contact[]> {
    return apiClient.get<Contact[]>('/contacts');
  },

  async getContactById(id: string): Promise<Contact> {
    return apiClient.get<Contact>(`/contacts/${id}`);
  },

  async createContact(data: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    return apiClient.post<Contact>('/contacts', data);
  },

  async updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
    return apiClient.put<Contact>(`/contacts/${id}`, data);
  },

  async deleteContact(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/contacts/${id}`);
  },
};

// Experiences API
export const experiencesApi = {
  async getExperiences(): Promise<Experience[]> {
    return apiClient.get<Experience[]>('/experiences');
  },

  async getExperienceById(id: string): Promise<Experience> {
    return apiClient.get<Experience>(`/experiences/${id}`);
  },

  async createExperience(data: Omit<Experience, '_id' | 'createdAt' | 'updatedAt'>): Promise<Experience> {
    return apiClient.post<Experience>('/experiences', data);
  },

  async updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
    return apiClient.put<Experience>(`/experiences/${id}`, data);
  },

  async deleteExperience(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/experiences/${id}`);
  },
};

// Skills API
export const skillsApi = {
  async getSkills(): Promise<Skill[]> {
    return apiClient.get<Skill[]>('/skills');
  },

  async getSkillById(id: string): Promise<Skill> {
    return apiClient.get<Skill>(`/skills/${id}`);
  },

  async createSkill(data: Omit<Skill, '_id' | 'createdAt' | 'updatedAt'>): Promise<Skill> {
    return apiClient.post<Skill>('/skills', data);
  },

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    return apiClient.put<Skill>(`/skills/${id}`, data);
  },

  async deleteSkill(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/skills/${id}`);
  },
};
