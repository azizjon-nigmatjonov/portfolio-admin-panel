import React, { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { portfolioApi, type PortfolioItem } from '@/services/portfolioApi';

// Mock data for development
const mockPortfolioData: PortfolioItem[] = [
  {
    id: '1',
    title: 'E-commerce Website',
    description: 'A modern e-commerce platform built with React and Node.js',
    category: 'Web Development',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    imageUrl: 'https://example.com/image1.jpg',
    tags: ['React', 'Node.js', 'E-commerce', 'MongoDB'],
  },
  {
    id: '2',
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application for iOS and Android',
    category: 'Mobile Development',
    status: 'active',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:20:00Z',
    imageUrl: 'https://example.com/image2.jpg',
    tags: ['React Native', 'TypeScript', 'Banking', 'Security'],
  },
  {
    id: '3',
    title: 'Data Analytics Dashboard',
    description: 'Real-time analytics dashboard with interactive charts',
    category: 'Data Science',
    status: 'inactive',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-12T13:30:00Z',
    imageUrl: 'https://example.com/image3.jpg',
    tags: ['Python', 'D3.js', 'Analytics', 'Dashboard'],
  },
  {
    id: '4',
    title: 'AI Chatbot',
    description: 'Intelligent customer service chatbot using NLP',
    category: 'Artificial Intelligence',
    status: 'draft',
    createdAt: '2024-01-20T15:45:00Z',
    updatedAt: '2024-01-22T10:15:00Z',
    tags: ['Python', 'NLP', 'AI', 'Chatbot'],
  },
  {
    id: '5',
    title: 'Cloud Infrastructure Setup',
    description: 'Scalable cloud infrastructure using AWS services',
    category: 'DevOps',
    status: 'active',
    createdAt: '2024-01-08T08:30:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  },
];

const columnHelper = createColumnHelper<PortfolioItem>();

const columns = [
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => (
      <div className="font-medium text-gray-900">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => (
      <div className="max-w-xs truncate text-gray-600">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      const statusVariants = {
        active: 'default',
        inactive: 'secondary',
        draft: 'outline',
      } as const;
      return (
        <Badge variant={statusVariants[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  }),
  columnHelper.accessor('tags', {
    header: 'Tags',
    cell: (info) => (
      <div className="flex flex-wrap gap-1">
        {info.getValue().slice(0, 2).map((tag, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {info.getValue().length > 2 && (
          <Badge variant="secondary" className="text-xs">
            +{info.getValue().length - 2} more
          </Badge>
        )}
      </div>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: (info) => (
      <div className="text-sm text-gray-500">
        {new Date(info.getValue()).toLocaleDateString()}
      </div>
    ),
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated',
    cell: (info) => (
      <div className="text-sm text-gray-500">
        {new Date(info.getValue()).toLocaleDateString()}
      </div>
    ),
  }),
];

const PortfolioPage: React.FC = () => {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'draft' as 'active' | 'inactive' | 'draft',
    tags: [] as string[],
    imageUrl: '',
  });

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first, fallback to mock data
        try {
          const apiData = await portfolioApi.getPortfolioItems();
          setData(apiData);
        } catch (apiError) {
          console.warn('API not available, using mock data:', apiError);
          setData(mockPortfolioData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio data');
        // Fallback to mock data on error
        setData(mockPortfolioData);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      status: 'draft',
      tags: [],
      imageUrl: '',
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({
      ...prev,
      tags,
    }));
  };

  const handleSubmit = async () => {
    try {
      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Try to create via API, fallback to local state update
      try {
        await portfolioApi.createPortfolioItem(newItem);
        setData(prev => [...prev, newItem]);
      } catch (apiError) {
        console.warn('API not available, adding to local state:', apiError);
        setData(prev => [...prev, newItem]);
      }

      handleModalClose();
    } catch (err) {
      console.error('Failed to create portfolio item:', err);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading portfolio data...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-gray-600 mt-1">
              Manage your portfolio items and projects
            </p>
          </div>
          <Button onClick={handleModalOpen} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Portfolio Item
          </Button>
        </div>
        {error && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Warning: {error}. Showing mock data for development.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No portfolio items found</div>
            <p className="text-gray-500 mt-2">Start by adding your first project</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {data.length} portfolio items
      </div>

      {/* Add Portfolio Item Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Portfolio Item</DialogTitle>
            <DialogDescription>
              Create a new portfolio item to showcase your work.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="col-span-3"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                className="col-span-3"
                placeholder="React, Node.js, TypeScript"
              />
            </div>
            
            {formData.tags.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-right pt-2">
                  <span className="text-sm text-gray-500">Preview</span>
                </div>
                <div className="col-span-3 flex flex-wrap gap-1">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = formData.tags.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, tags: newTags }));
                        }}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleSubmit}
              disabled={!formData.title || !formData.description || !formData.category}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioPage;
