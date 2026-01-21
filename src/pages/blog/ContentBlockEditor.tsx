import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import type { ContentBlock, ContentBlockType } from '@/services/blogApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { ContentBlockForm } from './ContentBlockForm';

interface ContentBlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const blockTypeLabels: Record<ContentBlockType, string> = {
  paragraph: 'Paragraph',
  heading: 'Heading',
  image: 'Image',
  video: 'Video',
  code: 'Code Block',
  quote: 'Quote',
  list: 'List',
  link: 'Link',
};

export const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({ blocks, onChange }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleAddBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      ...(type === 'heading' && { level: 2 }),
      ...(type === 'code' && { language: 'javascript' }),
      ...(type === 'list' && { items: [] }),
      ...(type === 'link' && { linkTitle: '', linkUrl: '', linkImage: '' }),
    };
    onChange([...blocks, newBlock]);
    setEditingIndex(blocks.length);
    setAddingNew(false);
  };

  const handleEditBlock = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveBlock = (updatedBlock: ContentBlock) => {
    if (editingIndex !== null) {
      const newBlocks = [...blocks];
      newBlocks[editingIndex] = updatedBlock;
      onChange(newBlocks);
      setEditingIndex(null);
    }
  };

  const handleDeleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
    // Add a slight delay to allow drag image to be set
    setTimeout(() => {
      if (e.dataTransfer) {
        e.dataTransfer.setDragImage(e.currentTarget as Element, 0, 0);
      }
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[draggedIndex];
    
    // Remove the dragged item
    newBlocks.splice(draggedIndex, 1);
    
    // Insert at new position
    newBlocks.splice(dropIndex, 0, draggedBlock);
    
    onChange(newBlocks);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getBlockPreview = (block: ContentBlock): string => {
    switch (block.type) {
      case 'paragraph':
        return block.content.substring(0, 100) + (block.content.length > 100 ? '...' : '');
      case 'heading':
        return `H${block.level || 2}: ${block.content}`;
      case 'image':
        return `Image: ${block.imageAlt || block.imageUrl || 'No image'}`;
      case 'video':
        return `Video: ${block.videoTitle || block.videoUrl || 'No video'}`;
      case 'code':
        return `Code (${block.language || 'text'}): ${block.content.substring(0, 50)}...`;
      case 'quote':
        return `"${block.content.substring(0, 80)}${block.content.length > 80 ? '...' : ''}"`;
      case 'list':
        return `List: ${block.items?.length || 0} items`;
      default:
        return 'Unknown block type';
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Block Button */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          onClick={() => setAddingNew(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Block
        </Button>
        {blocks.length > 0 && (
          <span className="text-sm text-gray-500">
            {blocks.length} block{blocks.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Blocks List */}
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`
              border rounded-lg p-4 transition-all cursor-move
              ${draggedIndex === index 
                ? 'opacity-50 border-blue-400 bg-blue-50' 
                : dragOverIndex === index
                ? 'border-blue-500 bg-blue-100 border-2 border-dashed'
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }
            `}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {/* Drag Handle */}
                <div className="flex items-center h-full pt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{blockTypeLabels[block.type]}</Badge>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{getBlockPreview(block)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditBlock(index)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteBlock(index)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No content blocks yet. Click "Add Block" to get started.</p>
        </div>
      )}

      {/* Add Block Type Selection Dialog */}
      <Dialog open={addingNew} onOpenChange={setAddingNew}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Content Block</DialogTitle>
            <DialogDescription>
              Select the type of content block you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {Object.entries(blockTypeLabels).map(([type, label]) => (
              <Button
                key={type}
                type="button"
                variant="outline"
                onClick={() => handleAddBlock(type as ContentBlockType)}
                className="h-auto py-3 flex flex-col items-center gap-2"
              >
                <span className="text-sm font-medium">{label}</span>
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddingNew(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Block Dialog */}
      {editingIndex !== null && (
        <ContentBlockForm
          block={blocks[editingIndex]}
          onSave={handleSaveBlock}
          onCancel={() => setEditingIndex(null)}
        />
      )}
    </div>
  );
};
