import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { skillsApi, type Skill } from '@/services/experienceApi';
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
  formData: Partial<Skill>;
  handleModalClose: () => void;
  modalOpen: boolean;
}

const categoryOptions = [
  { label: 'Core Technologies', value: 'Core Technologies' },
  { label: 'Performance & Architecture', value: 'Performance & Architecture' },
  { label: 'Testing & Quality', value: 'Testing & Quality' },
  { label: 'Development Tools', value: 'Development Tools' },
  { label: 'APIs & State Management', value: 'APIs & State Management' },
  { label: 'UI Libraries & Design', value: 'UI Libraries & Design' },
  { label: 'Leadership & Collaboration', value: 'Leadership & Collaboration' },
  { label: 'Additional Skills', value: 'Additional Skills' },
];

export const SkillForm: React.FC<Props> = ({ formData, handleModalClose, modalOpen }) => {
  const isEditMode = formData && (formData._id || formData.id);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset, formState: { isDirty } } = useForm<Skill>({
    defaultValues: {
      id: formData.id || '',
      name: formData.name || '',
      category: formData.category || 'Core Technologies',
      proficiency: formData.proficiency || 50,
      icon: formData.icon || '⭐',
    },
  });

  useEffect(() => {
    if (formData) {
      reset({
        id: formData.id || '',
        name: formData.name || '',
        category: formData.category || 'Core Technologies',
        proficiency: formData.proficiency || 50,
        icon: formData.icon || '⭐',
      });
    }
  }, [formData, reset]);

  const onSubmit = async (data: Skill) => {
    try {
      setIsLoading(true);
      const skillData: Skill = {
        ...data,
        id: formData.id || Date.now().toString(),
        proficiency: Number(data.proficiency),
      };

      if (isEditMode) {
        const id = formData._id || formData.id!;
        await skillsApi.updateSkill(id, skillData);
      } else {
        await skillsApi.createSkill(skillData);
      }

      reset();
      handleModalClose();
    } catch (err) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} skill:`, err);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} skill. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the skill information.' : 'Create a new skill entry.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <HFInput
            control={control}
            name="name"
            label="Skill Name"
            placeholder="e.g., JavaScript (ES6+)"
            required
          />

          <HFSelect
            control={control}
            name="category"
            label="Category"
            placeholder="Select category"
            options={categoryOptions}
            required
          />

          <HFInput
            control={control}
            name="proficiency"
            label="Proficiency"
            placeholder="0-100"
            type="number"
            min="0"
            max="100"
            required
            helperText="Enter a number between 0 and 100"
          />

          <HFInput
            control={control}
            name="icon"
            label="Icon"
            placeholder="e.g., ⚛️, 🟨, ⭐"
            helperText="Enter an emoji or icon to represent this skill"
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Skill' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
