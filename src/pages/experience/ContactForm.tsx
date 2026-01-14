import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactsApi, type Contact } from '@/services/experienceApi';
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
import { HFSelect } from '@/shared/components/HFElements/HFSelect';

interface Props {
  formData: Partial<Contact>;
  handleModalClose: () => void;
  modalOpen: boolean;
}

const contactTypeOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Website', value: 'website' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'GitHub', value: 'github' },
  { label: 'Twitter', value: 'twitter' },
  { label: 'Other', value: 'other' },
];

export const ContactForm: React.FC<Props> = ({ formData, handleModalClose, modalOpen }) => {
  const isEditMode = formData && (formData._id || formData.id);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset, watch, setValue, } = useForm<Contact>({
    defaultValues: {
      id: formData.id || '',
      type: formData.type || 'email',
      label: formData.label || '',
      value: formData.value || '',
      url: formData.url || '',
    },
  });

  const type = watch('type');
  const value = watch('value');

  // Auto-generate URL based on type and value
  useEffect(() => {
    if (type && value) {
      let generatedUrl = '';
      switch (type) {
        case 'email':
          generatedUrl = `mailto:${value}`;
          break;
        case 'phone':
          generatedUrl = `tel:${value.replace(/\s/g, '')}`;
          break;
        case 'website':
          generatedUrl = value.startsWith('http') ? value : `https://${value}`;
          break;
        case 'linkedin':
          generatedUrl = value.startsWith('http') ? value : `https://linkedin.com/in/${value}`;
          break;
        case 'github':
          generatedUrl = value.startsWith('http') ? value : `https://github.com/${value}`;
          break;
        case 'twitter':
          generatedUrl = value.startsWith('http') ? value : `https://twitter.com/${value}`;
          break;
        default:
          generatedUrl = value.startsWith('http') ? value : `https://${value}`;
      }
      setValue('url', generatedUrl, { shouldDirty: true });
    }
  }, [type, value, setValue]);

  useEffect(() => {
    if (formData) {
      reset({
        id: formData.id || '',
        type: formData.type || 'email',
        label: formData.label || '',
        value: formData.value || '',
        url: formData.url || '',
      });
    }
  }, [formData, reset]);

  const onSubmit = async (data: Contact) => {
    try {
      setIsLoading(true);
      const contactData: Contact = {
        ...data,
        id: formData.id || Date.now().toString(),
      };

      if (isEditMode) {
        const id = formData._id || formData.id!;
        await contactsApi.updateContact(id, contactData);
      } else {
        await contactsApi.createContact(contactData);
      }

      reset();
      handleModalClose();
    } catch (err) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} contact:`, err);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} contact. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the contact information.' : 'Create a new contact entry.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <HFSelect
            control={control}
            name="type"
            label="Type"
            placeholder="Select contact type"
            options={contactTypeOptions}
            required
          />

          <HFInput
            control={control}
            name="label"
            label="Label"
            placeholder="e.g., Email, Phone, LinkedIn"
            required
          />

          <HFInput
            control={control}
            name="value"
            label="Value"
            placeholder="Enter the contact value"
            required
          />

          <HFInput
            control={control}
            name="url"
            label="URL"
            placeholder="URL will be auto-generated based on type"
            helperText="URL is automatically generated based on type and value"
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Contact' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
