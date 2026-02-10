import React, { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { contactsApi, type Contact } from '@/services/experienceApi';
import { ContactForm } from './ContactForm';
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

const columnHelper = createColumnHelper<Contact>();

const ContactsPage: React.FC = () => {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Contact>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Contact | null>(null);

  const handleEdit = (item: Contact) => {
    setFormData(item);
    setModalOpen(true);
  };

  const handleDelete = (item: Contact) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const id = itemToDelete._id || itemToDelete.id;
      await contactsApi.deleteContact(id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchContactsData();
    } catch (err) {
      console.error('Failed to delete contact:', err);
      alert('Failed to delete contact. Please try again.');
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
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('label', {
      header: 'Label',
      cell: (info) => (
        <div className="text-sm text-gray-600">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('value', {
      header: 'Value',
      cell: (info) => (
        <div className="text-sm text-gray-600">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('url', {
      header: 'URL',
      cell: (info) => (
        <a
          href={info.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 underline truncate max-w-xs block"
        >
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated At',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() ? new Date(info.getValue()!).toLocaleString() : 'N/A'}
        </div>
      ),
    }),
  ];

  const fetchContactsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiData = await contactsApi.getContacts();
      setData(Array.isArray(apiData) ? apiData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactsData();
  }, []);

  const handleModalOpen = () => {
    setFormData({});
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({});
    fetchContactsData();
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
        <span className="ml-2 text-gray-600">Loading contacts...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-1">
              Manage your contact information
            </p>
          </div>
          <Button onClick={handleModalOpen} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Contact
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
                    <TableRowSkeleton key={i} columnCount={4} className="border-gray-200" />
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
            <div className="text-gray-400 text-lg">No contacts found</div>
            <p className="text-gray-500 mt-2">Start by adding your first contact</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {data.length} contacts
      </div>

      <ContactForm
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
              Are you sure you want to delete "{itemToDelete?.label}"? This action cannot be undone.
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

export default ContactsPage;
