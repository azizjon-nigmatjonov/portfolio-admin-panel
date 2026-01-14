import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { experiencesApi, type Experience } from '@/services/experienceApi';
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
import { Badge } from '@/shared/components/ui/badge';
import { X } from 'lucide-react';

interface Props {
  formData: Partial<Experience>;
  handleModalClose: () => void;
  modalOpen: boolean;
}

export const ExperienceForm: React.FC<Props> = ({ formData, handleModalClose, modalOpen }) => {
  const isEditMode = formData && (formData._id || formData.id);
  const [isLoading, setIsLoading] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>(formData.technologies || []);
  const [achievements, setAchievements] = useState<string[]>(formData.achievements || []);
  const [techInput, setTechInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  const { control, handleSubmit, reset, watch, formState: { isDirty } } = useForm<Experience>({
    defaultValues: {
      id: formData.id || '',
      company: formData.company || '',
      position: formData.position || '',
      location: formData.location || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || null,
      description: formData.description || '',
      technologies: formData.technologies || [],
      achievements: formData.achievements || [],
    },
  });

  useEffect(() => {
    if (formData) {
      reset({
        id: formData.id || '',
        company: formData.company || '',
        position: formData.position || '',
        location: formData.location || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || null,
        description: formData.description || '',
        technologies: formData.technologies || [],
        achievements: formData.achievements || [],
      });
      setTechnologies(formData.technologies || []);
      setAchievements(formData.achievements || []);
    }
  }, [formData, reset]);

  const onSubmit = async (data: Experience) => {
    try {
      setIsLoading(true);
      const experienceData: Experience = {
        ...data,
        id: formData.id || Date.now().toString(),
        technologies,
        achievements,
        endDate: data.endDate || null,
      };

      if (isEditMode) {
        const id = formData._id || formData.id!;
        await experiencesApi.updateExperience(id, experienceData);
      } else {
        await experiencesApi.createExperience(experienceData);
      }

      reset();
      setTechnologies([]);
      setAchievements([]);
      handleModalClose();
    } catch (err) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} experience:`, err);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} experience. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!technologies.includes(techInput.trim())) {
        setTechnologies([...technologies, techInput.trim()]);
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setTechnologies(technologies.filter(tech => tech !== techToRemove));
  };

  const handleAddAchievement = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && achievementInput.trim()) {
      e.preventDefault();
      if (!achievements.includes(achievementInput.trim())) {
        setAchievements([...achievements, achievementInput.trim()]);
      }
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (achievementToRemove: string) => {
    setAchievements(achievements.filter(achievement => achievement !== achievementToRemove));
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the experience details.' : 'Create a new work experience entry.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <HFInput
              control={control}
              name="company"
              label="Company"
              placeholder="Enter company name"
              required
            />
            <HFInput
              control={control}
              name="position"
              label="Position"
              placeholder="Enter position title"
              required
            />
            <HFInput
              control={control}
              name="location"
              label="Location"
              placeholder="Enter location"
              required
            />
            <HFInput
              control={control}
              name="startDate"
              label="Start Date"
              placeholder="YYYY-MM (e.g., 2024-08)"
              required
            />
            <HFInput
              control={control}
              name="endDate"
              label="End Date"
              placeholder="YYYY-MM or leave empty for current"
              helperText="Leave empty if this is your current position"
            />
          </div>

          <HFTextarea
            control={control}
            name="description"
            label="Description"
            placeholder="Enter job description"
            rows={4}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">Technologies</label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddTech}
              placeholder="Type and press Enter to add technology"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                  {tech}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTech(tech)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Achievements</label>
            <input
              type="text"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyDown={handleAddAchievement}
              placeholder="Type and press Enter to add achievement"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-col gap-2 mt-2">
              {achievements.map((achievement, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 justify-between p-2">
                  <span className="flex-1">{achievement}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveAchievement(achievement)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Experience' : 'Add Experience'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
