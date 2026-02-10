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
import { experiencesApi, type Experience } from '@/services/experienceApi';
import { ExperienceForm } from './ExperienceForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { motion } from 'framer-motion';
import { TableRowSkeleton } from '@/shared/components/ui/table';

const columnHelper = createColumnHelper<Experience>();

const ExperiencesPage: React.FC = () => {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Experience | null>(null);

  const handleEdit = (item: Experience) => {
    setFormData(item);
    setModalOpen(true);
  };

  const handleDelete = (item: Experience) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const id = itemToDelete._id || itemToDelete.id;
      await experiencesApi.deleteExperience(id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchExperiencesData();
    } catch (err) {
      console.error('Failed to delete experience:', err);
      alert('Failed to delete experience. Please try again.');
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
    columnHelper.accessor('company', {
      header: 'Company',
      cell: (info) => (
        <div className="font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('position', {
      header: 'Position',
      cell: (info) => (
        <div className="text-sm text-gray-600">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('startDate', {
      header: 'Start Date',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('endDate', {
      header: 'End Date',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() || 'Present'}
        </div>
      ),
    }),
    columnHelper.accessor('technologies', {
      header: 'Technologies',
      cell: (info) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {info.getValue().slice(0, 3).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {info.getValue().length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{info.getValue().length - 3}
            </Badge>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => (
        <div className="text-sm text-gray-600 truncate max-w-xs" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
  ];

  const fetchExperiencesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiData = await experiencesApi.getExperiences();
      setData(Array.isArray(apiData) ? apiData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load experiences');
      console.error('Failed to fetch experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiencesData();
  }, []);

  const handleModalOpen = () => {
    setFormData({});
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({});
    fetchExperiencesData();
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
        <span className="ml-2 text-gray-600">Loading experiences...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Experiences</h1>
            <p className="text-gray-600 mt-1">
              Manage your work experiences
            </p>
          </div>
          <Button onClick={handleModalOpen} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        </div>
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">Error: {error}</p>
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
              {loading ? (
                <>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columnCount={5} className="border-gray-200" />
                  ))}
                </>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(index * 0.04, 0.4),
                    }}
                    className="border-b border-gray-200 transition-colors hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <td key={row.id + cellIndex} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No experiences found</div>
            <p className="text-gray-500 mt-2">Start by adding your first experience</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {data.length} experiences
      </div>

      <ExperienceForm
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
              Are you sure you want to delete "{itemToDelete?.company}" experience? This action cannot be undone.
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

export default ExperiencesPage;
