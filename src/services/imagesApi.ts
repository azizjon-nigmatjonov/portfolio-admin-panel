import { apiClient } from '@/shared/api/client';

// Image item type definition
export interface ImageItem {
  _id: string;
  url: string;
  originalName: string;
  folder: string;
  uploadedAt: string;
}

// Images API service
export const imagesApi = {
  // Get all images
  async getImagesList(): Promise<ImageItem[]> {
    return apiClient.get<ImageItem[]>('/images');
  },

  // Get a specific image by ID
  async getImage(id: string): Promise<ImageItem> {
    return apiClient.get<ImageItem>(`/images/${id}`);
  },

  // Delete an image
  async deleteImage(id: string): Promise<void> {
    return apiClient.delete<void>(`/images/${id}`);
  },

  // Delete an image by URL
  async deleteImageByUrl(imageUrl: string): Promise<void> {
    return apiClient.post<void>('/delete-image', { imageUrl });
  },
};

