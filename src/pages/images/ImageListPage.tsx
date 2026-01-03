import React, { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { imagesApi, type ImageItem } from '@/services/imagesApi';
import { Button } from '@/shared/components/ui/button';

const columnHelper = createColumnHelper<ImageItem>();

const ImageListPage: React.FC = () => {
  const [data, setData] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (item: ImageItem) => {
    if (!confirm(`Are you sure you want to delete "${item._id}"?`)) {
      return;
    }

    try {
      setDeletingId(item._id);
      await imagesApi.deleteImageByUrl(item._id);
      // Refresh the data after deletion
      fetchImagesData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
      console.error('Failed to delete image:', err);
    } finally {
      setDeletingId(null);
    }
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
            onClick={() => handleDelete(row.original)}
            disabled={deletingId === row.original._id}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
    columnHelper.accessor('_id', {
      header: 'ID',
      cell: (info) => (
        <div className="text-sm text-gray-900 font-mono">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('url', {
      header: 'Image',
      cell: (info) => (
        <div onClick={() => window.open(info.getValue(), '_blank')}>
          <img 
            className='w-20 h-20 object-cover rounded' 
            src={info.getValue()} 
            alt="image" 
          />
        </div>
      ),
    }),
    columnHelper.accessor('originalName', {
      header: 'Original Name',
      cell: (info) => (
        <div className="text-sm text-gray-600">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('folder', {
      header: 'Folder',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('uploadedAt', {
      header: 'Uploaded At',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {new Date(info.getValue()).toLocaleString()}
        </div>
      ),
    }),
  ];

  const fetchImagesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiData = await imagesApi.getImagesList();
      setData(Array.isArray(apiData) ? apiData : (apiData as { images?: ImageItem[] })?.images || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images data');
      console.error('Failed to fetch images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImagesData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading images...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Image List</h1>
            <p className="text-gray-600 mt-1">
              View and manage your images
            </p>
          </div>
        </div>
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              Error: {error}
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
            <div className="text-gray-400 text-lg">No images found</div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {data.length} images
      </div>
    </div>
  );
};

export default ImageListPage;

