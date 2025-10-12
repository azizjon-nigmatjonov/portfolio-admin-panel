import React, { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';

import { Badge } from '@/shared/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { portfolioApi, type PortfolioItem } from '@/services/portfolioApi';
import { PortfolioForm } from './Form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

const columnHelper = createColumnHelper<PortfolioItem>();

const PortfolioPage: React.FC = () => {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);

  const handleEdit = (item: PortfolioItem) => {
    console.log('item', item);

    setFormData(item);
    setModalOpen(true);
  };

  const handleDelete = (item: PortfolioItem) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await portfolioApi.deletePortfolioItem(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      // Refresh the data after deletion
      fetchPortfolioData();
    } catch (err) {
      console.error('Failed to delete portfolio item:', err);
      // You can add error handling here (e.g., show a toast notification)
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const columns = [
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
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
    columnHelper.accessor('tool', {
      header: 'Tool',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('stack', {
      header: 'Stack',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('showing_image_url', {
      header: 'Showing Image URL',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('showing_inner_image_url', {
      header: 'Showing Inner Image URL',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('problem_image_url', {
      header: 'Problem Image URL',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('production_image_url_1', {
      header: 'Production Image URL 1',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('production_image_url_2', {
      header: 'Production Image URL 2',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('production_image_url_3', {
      header: 'Production Image URL 3',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('production_image_url_4', {
      header: 'Production Image URL 4',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('next_project_image_url', {
      header: 'Next Project Image URL',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('created_date', {
      header: 'Created Date',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Created At',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('updated_at', {
      header: 'Updated At',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
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
    columnHelper.accessor('problem_statement', {
      header: 'Problem Statement',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('production_detailed_statment', {
      header: 'Production Detailed Statement',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('intro_statment', {
      header: 'Intro Statement',
      cell: (info) => (
        <div className="text-sm text-gray-500 whitespace-normal min-w-[300px]">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Created',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    }),
    columnHelper.accessor('updated_at', {
      header: 'Updated',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    }),
  ];

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

      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio data');

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const handleModalOpen = () => {
    setFormData({});
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
      showing_image_url: '',
      showing_inner_image_url: '',
      problem_image_url: '',
      production_image_url_1: '',
      production_image_url_2: '',
      production_image_url_3: '',
      production_image_url_4: '',
      next_project_image_url: '',
      tool: '',
      stack: [],
    });
    fetchPortfolioData();
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
              {table.getHeaderGroups().map((headerGroup, rowIndex) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, colIndex) => (
                    <th
                      key={rowIndex + colIndex}
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
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <td key={row.id + cellIndex} className="px-6 py-4 whitespace-nowrap">
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

      <PortfolioForm
        formData={formData}
        handleModalClose={handleModalClose}
        modalOpen={modalOpen}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioPage;
