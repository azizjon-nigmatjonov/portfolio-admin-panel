import { apiClient } from '@/shared/api/client';

// Portfolio item type definition
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  release_date: string;
  created_date: string;
  tool: string;
  category: string;
  stack: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
  problem_statement: string;
  production_detailed_statment: string;
  intro_statment: string;
  showing_image_url: string;
  showing_inner_image_url: string;
  problem_image_url: string;
  production_image_url_1: string;
  production_image_url_2: string;
  production_image_url_3: string;
  production_image_url_4: string;
  next_project_image_url: string;
}

// Portfolio API service
export const portfolioApi = {
  // Get all portfolio items
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return apiClient.get<PortfolioItem[]>('/portfolios');
  },

  // Get a specific portfolio item by ID
  async getPortfolioItem(id: string): Promise<PortfolioItem> {
    return apiClient.get<PortfolioItem>(`/portfolios/${id}`);
  },

  // Create a new portfolio item
  async createPortfolioItem(data: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PortfolioItem> {
    return apiClient.post<PortfolioItem>('/portfolios', data);
  },

  // Update a portfolio item
  async updatePortfolioItem(id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem> {
    return apiClient.put<PortfolioItem>(`/portfolios/${id}`, data);
  },

  // Delete a portfolio item
  async deletePortfolioItem(id: string): Promise<void> {
    return apiClient.delete<void>(`/portfolios/${id}`);
  },
};
