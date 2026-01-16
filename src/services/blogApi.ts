import { apiClient } from '@/shared/api/client';

// Content Block Types
export type ContentBlockType = 'paragraph' | 'heading' | 'image' | 'video' | 'code' | 'quote' | 'list';

export type ContentBlock = {
  id: string;
  type: ContentBlockType;
  content: string;
  level?: number; // For headings (1-6)
  imageUrl?: string; // For images
  imageAlt?: string; // For images
  videoUrl?: string; // For videos
  videoTitle?: string; // For videos
  language?: string; // For code blocks
  items?: string[]; // For lists
};

// Author Type
export type Author = {
  name: string;
  avatar: string;
};

// Blog Post Type
export type BlogPost = {
  _id?: string;
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: Author;
  publishedAt: string;
  readTime: number;
  tags: string[];
  category: string;
  featuredImage?: string;
  content: ContentBlock[];
  views: number;
  likes: number;
  createdAt?: string;
  updatedAt?: string;
};

// Blog API service
export const blogApi = {
  // Get all blog posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return apiClient.get<BlogPost[]>('/blog/posts');
  },

  // Get blog post by ID or slug
  async getBlogPost(id: string): Promise<BlogPost> {
    return apiClient.get<BlogPost>(`/blog/posts/${id}`);
  },

  // Get blog post by slug (alternative endpoint)
  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return apiClient.get<BlogPost>(`/blog/posts/slug/${slug}`);
  },

  // Create blog post
  async createBlogPost(data: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): Promise<BlogPost> {
    return apiClient.post<BlogPost>('/blog/posts', data);
  },

  // Update blog post
  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return apiClient.put<BlogPost>(`/blog/posts/${id}`, data);
  },

  // Delete blog post
  async deleteBlogPost(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/blog/posts/${id}`);
  },

  // Increment views (public)
  async incrementViews(id: string): Promise<BlogPost> {
    return apiClient.post<BlogPost>(`/blog/posts/${id}/views`, {});
  },

  // Toggle like (protected)
  async toggleLike(id: string): Promise<BlogPost> {
    return apiClient.post<BlogPost>(`/blog/posts/${id}/like`, {});
  },

  // Get all categories
  async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/blog/categories');
  },

  // Get all tags
  async getTags(): Promise<string[]> {
    return apiClient.get<string[]>('/blog/tags');
  },

  // Get posts by category
  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    return apiClient.get<BlogPost[]>(`/blog/category/${encodeURIComponent(category)}`);
  },

  // Get posts by tag
  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    return apiClient.get<BlogPost[]>(`/blog/tag/${encodeURIComponent(tag)}`);
  },
};
