import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { aboutMeApi, type AboutMe } from '@/services/experienceApi';
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
import { HFImageUpload } from '@/shared/components/HFElements/HFImageUpload';

interface Props {
  formData: Partial<AboutMe>;
  handleModalClose: () => void;
  modalOpen: boolean;
}

export const AboutMeForm: React.FC<Props> = ({ formData, handleModalClose, modalOpen }) => {
  const isEditMode = formData && formData._id;
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset, } = useForm<AboutMe>({
    defaultValues: {
      title: formData.title || 'About Me',
      content: formData.content || '',
      image: formData.image || '',
    },
  });

  useEffect(() => {
    if (formData) {
      reset({
        title: formData.title || 'About Me',
        content: formData.content || '',
        image: formData.image || '',
      });
    }
  }, [formData, reset]);

  const onSubmit = async (data: AboutMe) => {
    try {
      setIsLoading(true);
      if (isEditMode) {
        await aboutMeApi.updateAboutMe(data);
      } else {
        await aboutMeApi.createAboutMe(data);
      }
      reset();
      handleModalClose();
    } catch (err) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} about me:`, err);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} about me. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit About Me' : 'Create About Me'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update your about me information.' : 'Create your about me information.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <HFInput
            control={control}
            name="title"
            label="Title"
            placeholder="Enter title"
            required
          />

          <HFImageUpload
            control={control}
            name="image"
            label="Image"
            helperText="Upload your profile image"
          />

          <HFTextarea
            control={control}
            name="content"
            label="Content"
            placeholder="Enter your about me content"
            rows={10}
            required
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
