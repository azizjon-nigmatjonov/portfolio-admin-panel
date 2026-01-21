import React, { useState, useEffect } from 'react';
import type { ContentBlock } from '@/services/blogApi';
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
import { HFSelect } from '@/shared/components/HFElements/HFSelect';
import { Badge } from '@/shared/components/ui/badge';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ContentBlockFormProps {
  block: ContentBlock;
  onSave: (block: ContentBlock) => void;
  onCancel: () => void;
}

const headingLevelOptions = [
  { label: 'H1', value: '1' },
  { label: 'H2', value: '2' },
  { label: 'H3', value: '3' },
  { label: 'H4', value: '4' },
  { label: 'H5', value: '5' },
  { label: 'H6', value: '6' },
];

const codeLanguageOptions = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'CSS', value: 'css' },
  { label: 'HTML', value: 'html' },
  { label: 'JSON', value: 'json' },
  { label: 'SQL', value: 'sql' },
  { label: 'Bash', value: 'bash' },
  { label: 'Text', value: 'text' },
];

export const ContentBlockForm: React.FC<ContentBlockFormProps> = ({ block, onSave, onCancel }) => {
  const [listItems, setListItems] = useState<string[]>(block.items || []);
  const [listItemInput, setListItemInput] = useState('');

  const { control, handleSubmit, reset } = useForm<ContentBlock>({
    defaultValues: {
      ...block,
      content: block.content || '',
      imageUrl: block.imageUrl || '',
      imageAlt: block.imageAlt || '',
      videoUrl: block.videoUrl || '',
      videoTitle: block.videoTitle || '',
      linkTitle: block.linkTitle || '',
      linkUrl: block.linkUrl || '',
      linkImage: block.linkImage || '',
      level: block.level || 2,
      language: block.language || 'javascript',
    },
  });

  useEffect(() => {
    reset({
      ...block,
      content: block.content || '',
      imageUrl: block.imageUrl || '',
      imageAlt: block.imageAlt || '',
      videoUrl: block.videoUrl || '',
      videoTitle: block.videoTitle || '',
      linkTitle: block.linkTitle || '',
      linkUrl: block.linkUrl || '',
      linkImage: block.linkImage || '',
      level: block.level || 2,
      language: block.language || 'javascript',
    });
    setListItems(block.items || []);
  }, [block, reset]);

  const onSubmit = (data: ContentBlock & { level?: string | number; language?: string }) => {
    const updatedBlock: ContentBlock = {
      id: data.id,
      type: data.type,
      content: data.content || '', // Ensure content is preserved
      level: data.type === 'heading' ? Number(data.level) : undefined,
      items: data.type === 'list' ? listItems : undefined,
      // Ensure all optional fields are properly set
      imageUrl: data.type === 'image' ? (data.imageUrl || '') : undefined,
      imageAlt: data.type === 'image' ? (data.imageAlt || '') : undefined,
      videoUrl: data.type === 'video' ? (data.videoUrl || '') : undefined,
      videoTitle: data.type === 'video' ? (data.videoTitle || '') : undefined,
      language: data.type === 'code' ? (data.language || 'javascript') : undefined,
      linkTitle: data.type === 'link' ? (data.linkTitle || '') : undefined,
      linkUrl: data.type === 'link' ? (data.linkUrl || '') : undefined,
      linkImage: data.type === 'link' ? (data.linkImage || '') : undefined,
    };

    onSave(updatedBlock);
  };

  const handleAddListItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && listItemInput.trim()) {
      e.preventDefault();
      if (!listItems.includes(listItemInput.trim())) {
        setListItems([...listItems, listItemInput.trim()]);
      }
      setListItemInput('');
    }
  };

  const handleRemoveListItem = (itemToRemove: string) => {
    setListItems(listItems.filter(item => item !== itemToRemove));
  };

  const renderFields = () => {
    switch (block.type) {
      case 'paragraph':
        return (
          <HFTextarea
            control={control}
            name="content"
            label="Paragraph Content"
            placeholder="Enter paragraph text"
            rows={6}
            required
          />
        );

      case 'heading':
        return (
          <div className="space-y-4">
            <HFSelect
              control={control}
              name="level"
              label="Heading Level"
              options={headingLevelOptions}
              required
            />
            <HFInput
              control={control}
              name="content"
              label="Heading Text"
              placeholder="Enter heading text"
              required
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <HFInput
              control={control}
              name="imageUrl"
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              type="url"
              required
              helperText="Full URL to the image"
            />
            <HFInput
              control={control}
              name="imageAlt"
              label="Image Alt Text"
              placeholder="Description of the image"
              helperText="Alternative text for accessibility"
            />
            <HFInput
              control={control}
              name="content"
              label="Caption (optional)"
              placeholder="Image caption"
            />
          </div>
        );

      case 'link':
        return (
          <div className="space-y-4">
            <HFInput
              control={control}
              name="linkTitle"
              label="Link Title"
              placeholder="e.g., View Project"
              required
            />
            <HFInput
              control={control}
              name="linkUrl"
              label="Link URL"
              placeholder="https://example.com"
              type="url"
              required
              helperText="Full URL for the link target"
            />
            <HFInput
              control={control}
              name="linkImage"
              label="Link Image (optional)"
              placeholder="https://example.com/preview.jpg"
              type="url"
              helperText="Preview image for the link (optional)"
            />
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <HFInput
              control={control}
              name="videoUrl"
              label="Video URL"
              placeholder="https://youtu.be/example"
              type="url"
              required
              helperText="YouTube or other video platform URL"
            />
            <HFInput
              control={control}
              name="videoTitle"
              label="Video Title (optional)"
              placeholder="Video title"
            />
            <HFInput
              control={control}
              name="content"
              label="Description (optional)"
              placeholder="Video description"
            />
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <HFSelect
              control={control}
              name="language"
              label="Programming Language"
              options={codeLanguageOptions}
              required
            />
            <HFTextarea
              control={control}
              name="content"
              label="Code"
              placeholder="Enter your code here"
              rows={10}
              required
              helperText="Code will be displayed in a code block"
            />
          </div>
        );

      case 'quote':
        return (
          <HFTextarea
            control={control}
            name="content"
            label="Quote Text"
            placeholder="Enter quote text"
            rows={4}
            required
          />
        );

      case 'list':
        return (
          <div className="space-y-4">
            <HFInput
              control={control}
              name="content"
              label="List Title (optional)"
              placeholder="List title"
            />
            <div>
              <label className="block text-sm font-medium mb-2">List Items</label>
              <input
                type="text"
                value={listItemInput}
                onChange={(e) => setListItemInput(e.target.value)}
                onKeyDown={handleAddListItem}
                placeholder="Type and press Enter to add item"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-col gap-2 mt-2">
                {listItems.map((item, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 justify-between p-2">
                    <span className="flex-1">{item}</span>
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveListItem(item)}
                    />
                  </Badge>
                ))}
              </div>
              {listItems.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No items yet. Add items above.</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block</DialogTitle>
          <DialogDescription>
            Update the content block details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {renderFields()}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit(onSubmit)}>
              Save Block
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
