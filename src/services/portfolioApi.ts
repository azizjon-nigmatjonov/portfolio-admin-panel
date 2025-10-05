import { apiClient } from '@/shared/api/client';

// Portfolio item type definition
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  tags: string[];
}

// Portfolio API service
export const portfolioApi = {
  // Get all portfolio items
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return apiClient.get<PortfolioItem[]>('/portfolio');
  },

  // Get a specific portfolio item by ID
  async getPortfolioItem(id: string): Promise<PortfolioItem> {
    return apiClient.get<PortfolioItem>(`/portfolio/${id}`);
  },

  // Create a new portfolio item
  async createPortfolioItem(data: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PortfolioItem> {
    return apiClient.post<PortfolioItem>('/portfolio', data);
  },

  // Update a portfolio item
  async updatePortfolioItem(id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem> {
    return apiClient.put<PortfolioItem>(`/portfolio/${id}`, data);
  },

  // Delete a portfolio item
  async deletePortfolioItem(id: string): Promise<void> {
    return apiClient.delete<void>(`/portfolio/${id}`);
  },
};
