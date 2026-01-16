import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { blogApi } from '@/services/blogApi';
import type { BlogPost, ContentBlock } from '@/services/blogApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { HFInput } from '@/shared/components/HFElements/HFInput';
import { HFTextarea } from '@/shared/components/HFElements/HFTextarea';
import { HFImageUpload } from '@/shared/components/HFElements/HFImageUpload';
import { Badge } from '@/shared/components/ui/badge';
import { X } from 'lucide-react';
import { ContentBlockEditor } from './ContentBlockEditor';

interface Props {
  formData: Partial<BlogPost>;
  handleModalClose: () => void;
  modalOpen: boolean;
}

export const BlogForm: React.FC<Props> = ({ formData, handleModalClose, modalOpen }) => {
  const isEditMode = formData && (formData._id || formData.id);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>(formData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(formData.content || []);

  const { control, handleSubmit, reset, watch, setValue } = useForm<BlogPost>({
    defaultValues: {
      id: formData.id || '',
      slug: formData.slug || '',
      title: formData.title || '',
      excerpt: formData.excerpt || '',
      author: formData.author || {
        name: 'Azizjon Nigmatjonov',
        avatar: '',
      },
      publishedAt: formData.publishedAt || new Date().toISOString(),
      readTime: formData.readTime || 5,
      tags: formData.tags || [],
      category: formData.category || '',
      featuredImage: formData.featuredImage || '',
      content: formData.content || [],
      views: formData.views || 0,
      likes: formData.likes || 0,
    },
  });

  // Auto-generate slug from title
  const title = watch('title');
  useEffect(() => {
    if (title && !isEditMode) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [title, isEditMode, setValue]);

  // Convert ISO date to datetime-local format
  const formatDateForInput = (isoDate: string | undefined): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (formData) {
      reset({
        id: formData.id || '',
        slug: formData.slug || '',
        title: formData.title || '',
        excerpt: formData.excerpt || '',
        author: formData.author || {
          name: 'Azizjon Nigmatjonov',
          avatar: '',
        },
        publishedAt: formatDateForInput(formData.publishedAt) || formatDateForInput(new Date().toISOString()),
        readTime: formData.readTime || 5,
        tags: formData.tags || [],
        category: formData.category || '',
        featuredImage: formData.featuredImage || '',
        content: formData.content || [],
        views: formData.views || 0,
        likes: formData.likes || 0,
      });
      setTags(formData.tags || []);
      setContentBlocks(formData.content || []);
    }
  }, [formData, reset]);

  const onSubmit = async (data: BlogPost) => {
    try {
      setIsLoading(true);
      
      // Convert datetime-local to ISO string if needed
      let publishedAt = data.publishedAt;
      if (publishedAt && !publishedAt.includes('T')) {
        // If it's in datetime-local format, convert to ISO
        publishedAt = new Date(publishedAt).toISOString();
      }
      
      const blogData: BlogPost = {
        ...data,
        id: formData.id || Date.now().toString(),
        publishedAt: publishedAt || new Date().toISOString(),
        tags,
        content: contentBlocks,
        views: formData.views || 0,
        likes: formData.likes || 0,
      };

      if (isEditMode) {
        const id = formData._id || formData.id || formData.slug!;
        await blogApi.updateBlogPost(id, blogData);
      } else {
        blogData.content = contentBlocks.length > 0 ? contentBlocks : [];
        await blogApi.createBlogPost(blogData);
      }

      reset();
      setTags([]);
      setContentBlocks([]);
      handleModalClose();
    } catch (err) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} blog post:`, err);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} blog post. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the blog post details.' : 'Create a new blog post.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <HFInput
                control={control}
                name="title"
                label="Title"
                placeholder="Enter blog post title"
                required
              />
              <HFInput
                control={control}
                name="slug"
                label="Slug"
                placeholder="URL-friendly identifier"
                required
                helperText="Auto-generated from title, but you can edit it"
              />
              <HFInput
                control={control}
                name="category"
                label="Category"
                placeholder="e.g., Web Development"
                required
              />
              <HFInput
                control={control}
                name="readTime"
                label="Read Time (minutes)"
                type="number"
                placeholder="5"
                required
              />
              <HFInput
                control={control}
                name="publishedAt"
                label="Published At"
                type="text"
                required
                helperText="Publication date and time (YYYY-MM-DDTHH:mm format)"
              />
              <div className="col-span-2">
                <HFTextarea
                  control={control}
                  name="excerpt"
                  label="Excerpt"
                  placeholder="Brief description of the blog post"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          {/* Author Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Author Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <HFInput
                control={control}
                name="author.name"
                label="Author Name"
                placeholder="Author name"
                required
              />
              <HFImageUpload
                control={control}
                name="author.avatar"
                label="Author Avatar"
                helperText="Author profile image URL"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Featured Image</h3>
            <HFImageUpload
              control={control}
              name="featuredImage"
              label="Featured Image"
              helperText="Main image for the blog post"
            />
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type and press Enter to add tags"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Content Blocks */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Content</h3>
            <ContentBlockEditor
              blocks={contentBlocks}
              onChange={setContentBlocks}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Post' : 'Create Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
