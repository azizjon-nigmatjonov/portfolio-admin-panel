"use client"

import { portfolioApi, type PortfolioItem } from '@/services/portfolioApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useForm } from 'react-hook-form';
import { HFInput } from '@/shared/components/HFElements/HFInput';
import { HFTextarea } from '@/shared/components/HFElements/HFTextarea';
import { HFSelect } from '@/shared/components/HFElements/HFSelect';
import { HFImageUpload } from '@/shared/components/HFElements/HFImageUpload';
import { useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { X } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';

interface Props { 
  formData: Partial<PortfolioItem>;
  handleModalClose: () => void;
  modalOpen: boolean;
}

const categoryOptions = [
  { label: 'Web Development', value: 'web' },
  { label: 'Mobile Development', value: 'mobile' },
  { label: 'Design', value: 'design' },
  { label: 'AI/ML', value: 'ai_ml' },
  { label: 'Other', value: 'other' },
];

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Draft', value: 'draft' },
];

export const PortfolioForm = ({ formData, handleModalClose, modalOpen }: Props) => {
  const isEditMode = formData && formData.id;
  const [tags, setTags] = useState<string[]>(formData.tags || []);
  const [stack, setStack] = useState<string[]>(formData.stack || []);
  const [tagInput, setTagInput] = useState('');
  const [stackInput, setStackInput] = useState('');

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<PortfolioItem>({
    defaultValues: {
          title: formData.title || '',
          description: formData.description || '',
          category: formData.category || '',
          status: formData.status || 'draft',
          tool: formData.tool || '',
          problem_statement: formData.problem_statement || '',
          production_detailed_statment: formData.production_detailed_statment || '',
          intro_statment: formData.intro_statment || '',
          showing_image_url: formData.showing_image_url || '',
          showing_inner_image_url: formData.showing_inner_image_url || '',
          problem_image_url: formData.problem_image_url || '',
          production_image_url_1: formData.production_image_url_1 || '',
          production_image_url_2: formData.production_image_url_2 || '',
          production_image_url_3: formData.production_image_url_3 || '',
          production_image_url_4: formData.production_image_url_4 || '',
          next_project_image_url: formData.next_project_image_url || '',
    } as PortfolioItem,
  });

  const onSubmit = async (data: PortfolioItem) => {
    try {
      const portfolioData: PortfolioItem = {
        ...data,
        tags,
        stack,
        id: formData.id || Date.now().toString(),
        created_date: formData.created_date || new Date().toISOString(),
        created_at: formData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isEditMode) {
        // Update existing item
        await portfolioApi.updatePortfolioItem(portfolioData.id, portfolioData);
      } else {
        // Create new item
        await portfolioApi.createPortfolioItem(portfolioData);
      }

      reset();
      handleModalClose();
    } catch (err) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} portfolio item:`, err);
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

  const handleAddStack = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && stackInput.trim()) {
      e.preventDefault();
      if (!stack.includes(stackInput.trim())) {
        setStack([...stack, stackInput.trim()]);
      }
      setStackInput('');
    }
  };

  const handleRemoveStack = (stackToRemove: string) => {
    setStack(stack.filter(item => item !== stackToRemove));
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the portfolio item details.' : 'Create a new portfolio item to showcase your work.'}
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
                placeholder="Enter project title"
                required
              />
              <HFSelect
                control={control}
                name="category"
                label="Category"
                placeholder="Select category"
                options={categoryOptions}
                required
              />
              <HFSelect
                control={control}
                name="status"
                label="Status"
                placeholder="Select status"
                options={statusOptions}
                required
              />
              <HFInput
                control={control}
                name="tool"
                label="Tool"
                placeholder="Main tool used"
              />
              <div>
                <Label className="block text-sm font-medium mb-2">Tags</Label>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type and press Enter to add tags"
                  className="h-9"
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
              <div>
                <Label className="block text-sm font-medium mb-2">Tech Stack</Label>
                <Input
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  onKeyDown={handleAddStack}
                  placeholder="Type and press Enter to add stack"
                  className="h-9"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {stack.map((item) => (
                    <Badge key={item} variant="secondary" className="flex items-center gap-1">
                      {item}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveStack(item)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <HFTextarea
                  control={control}
                  name="description"
                  label="Description"
                  placeholder="Brief description of the project"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <HFTextarea
                  control={control}
                  name="intro_statment"
                  label="Introduction Statement"
                  placeholder="Project introduction"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <HFTextarea
                  control={control}
                  name="problem_statement"
                  label="Problem Statement"
                  placeholder="What problem does this project solve?"
                  rows={4}
                />
              </div>
              <div className="col-span-2">
                <HFTextarea
                  control={control}
                  name="production_detailed_statment"
                  label="Production Details"
                  placeholder="Detailed production information"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Images</h3>
            <div className="grid grid-cols-2 gap-4">
              <HFImageUpload
                control={control}
                name="showing_image_url"
                label="Showing Image"
                helperText="Main display image"
              />
              <HFImageUpload
                control={control}
                name="showing_inner_image_url"
                label="Inner Showing Image"
                helperText="Secondary display image"
              />
              <HFImageUpload
                control={control}
                name="problem_image_url"
                label="Problem Image"
                helperText="Image illustrating the problem"
              />
              <HFImageUpload
                control={control}
                name="next_project_image_url"
                label="Next Project Image"
                helperText="Image for next project preview"
              />
            </div>
          </div>

          {/* Production Images */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Production Images</h3>
            <div className="grid grid-cols-2 gap-4">
              <HFImageUpload
                control={control}
                name="production_image_url_1"
                label="Production Image 1"
              />
              <HFImageUpload
                control={control}
                name="production_image_url_2"
                label="Production Image 2"
              />
              <HFImageUpload
                control={control}
                name="production_image_url_3"
                label="Production Image 3"
              />
              <HFImageUpload
                control={control}
                name="production_image_url_4"
                label="Production Image 4"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isDirty}
            >
              {isEditMode ? 'Update Item' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
