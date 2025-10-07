import { tokenService } from './tokenService';

// Upload image response type
export interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
  message: string;
}

// Upload API service
export const uploadApi = {
  /**
   * Upload image to backend
   * @param file - The image file to upload
   * @returns Promise with the uploaded image URL
   */
  async uploadImage(file: File): Promise<UploadImageResponse> {
    // Get Firebase auth token
    const authToken = await tokenService.getIdToken();
    
    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('image', file);  // ✅ Changed from 'file' to 'image'
    formData.append('folder', 'images');  // ✅ Optional: specify folder
    console.log('formData', formData);
    console.log('file', file);
    
    // Send to backend
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/upload-image`, {  // ✅ Added /api/
      method: 'POST',
      headers: {
        'authtoken': authToken,
        // DON'T set Content-Type - browser sets it automatically with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(`Upload failed: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    return result;
  },
};