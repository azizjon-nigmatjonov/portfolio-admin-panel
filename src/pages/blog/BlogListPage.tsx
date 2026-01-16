import React, { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { blogApi, type BlogPost } from '@/services/blogApi';
import { BlogForm } from './BlogForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

const columnHelper = createColumnHelper<BlogPost>();

const BlogListPage: React.FC = () => {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BlogPost | null>(null);

  const handleEdit = (item: BlogPost) => {
    setFormData(item);
    setModalOpen(true);
  };

  const handleDelete = (item: BlogPost) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const id = itemToDelete._id || itemToDelete.id || itemToDelete.slug;
      await blogApi.deleteBlogPost(id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchBlogPosts();
    } catch (err) {
      console.error('Failed to delete blog post:', err);
      alert('Failed to delete blog post. Please try again.');
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
    columnHelper.accessor('featuredImage', {
      header: 'Image',
      cell: (info) => {
        const imageUrl = info.getValue();
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Featured"
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        );
      },
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => (
        <div className="font-medium text-gray-900 max-w-xs">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('slug', {
      header: 'Slug',
      cell: (info) => (
        <div className="text-sm text-gray-500 font-mono max-w-xs truncate">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => (
        <Badge variant="secondary">
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('tags', {
      header: 'Tags',
      cell: (info) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {info.getValue().slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {info.getValue().length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{info.getValue().length - 2}
            </Badge>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('author.name', {
      header: 'Author',
      cell: (info) => (
        <div className="text-sm text-gray-600">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('publishedAt', {
      header: 'Published',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    }),
    columnHelper.accessor('readTime', {
      header: 'Read Time',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()} min
        </div>
      ),
    }),
    columnHelper.accessor('views', {
      header: 'Views',
      cell: (info) => (
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('likes', {
      header: 'Likes',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
  ];

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiData = await blogApi.getBlogPosts();
      setData(Array.isArray(apiData) ? apiData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
      console.error('Failed to fetch blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleModalOpen = () => {
    setFormData({});
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({});
    fetchBlogPosts();
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
        <span className="ml-2 text-gray-600">Loading blog posts...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-600 mt-1">
              Manage your blog posts and articles
            </p>
          </div>
          <Button onClick={handleModalOpen} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Blog Post
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
            <div className="text-gray-400 text-lg">No blog posts found</div>
            <p className="text-gray-500 mt-2">Start by adding your first blog post</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {data.length} blog posts
      </div>

      <BlogForm
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

export default BlogListPage;
