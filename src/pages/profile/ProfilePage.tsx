import React from 'react';
import { useForm } from 'react-hook-form';
import { useProfileLogic } from './Logic';
import { useAuthStore } from '@/features/auth/store/authSlice';
import { HFInput } from '@/shared/components/HFElements/HFInput';
import { HFImageUpload } from '@/shared/components/HFElements/HFImageUpload';
import { Button } from '@/shared/components/Button/Button';

interface ProfileFormData {
  name: string;
  email: string;
  work_experience: string;
  role: string;
  id: string;
  about_me: string;
  profilePicture?: File | string;
  linkedin_url: string;
  github_url: string;
  resume_url: string;
}

const ProfilePage: React.FC = () => {
  const { userInfo, isLoading, isUpdating, updateUserProfile } = useProfileLogic();
  const { error } = useAuthStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty }
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      email: '',
      work_experience: '',
      role: '',
      id: '',
      profilePicture: '',
      about_me: '',
      linkedin_url: '',
      github_url: '',
      resume_url: ''
    }
  });

  // Reset form when userInfo changes
  React.useEffect(() => {
    if (userInfo) {
      reset({
        name: userInfo.name || '',
        email: userInfo.email || '',
        role: userInfo.role || '',
        id: userInfo.id || '',
        profilePicture: userInfo.profilePicture || '',
        work_experience: userInfo.work_experience || '',
        about_me: userInfo.about_me || '',
        linkedin_url: userInfo.linkedin_url || '',
        github_url: userInfo.github_url || '',
        resume_url: userInfo.resume_url || ''
      });
    }
  }, [userInfo, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updateData: any = {
        name: data.name,
        email: data.email,
        work_experience: data.work_experience,
        about_me: data.about_me,
        linkedin_url: data.linkedin_url,
        github_url: data.github_url,
        resume_url: data.resume_url,
      };

      // Handle profilePicture upload if it's a File object
      if (data.profilePicture instanceof File) {
        updateData.profilePicture = data.profilePicture;
      }

      await updateUserProfile(updateData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {userInfo ? (
            <div className="space-y-6">
              <HFInput
                control={control}
                name="name"
                label="Name"
                placeholder="Enter your name"
                required
                rules={{
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                }}
              />

              <HFInput
                control={control}
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                required
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
              />

              <HFInput
                control={control}
                name="about_me"
                label="About Me"
                placeholder="Enter your about me"
                required
                rules={{
                  required: 'About Me is required',
                  minLength: {
                    value: 10,
                    message: 'About Me must be at least 10 characters'
                  }
                }}
              />


              <HFInput
                control={control}
                name="work_experience"
                label="Work Experience"
                placeholder="Enter your work experience"
                required
                rules={{
                  required: 'Work Experience is required',
                  minLength: {
                    value: 4,
                    message: 'Work Experience must be at least 4 characters'
                  }
                }}
              />

              <HFInput
                control={control}
                name="linkedin_url"
                label="Linkedin URL"
                placeholder="Enter your linkedin url"
                required
                rules={{
                  required: 'Linkedin URL is required',
                  minLength: {
                    value: 5,
                    message: 'Linkedin URL must be at least 5 characters'
                  }
                }}
              />

              <HFInput
                control={control}
                name="github_url"
                label="Github URL"
                placeholder="Enter your github url"
                required
                rules={{
                  required: 'Github URL is required',
                  minLength: {
                    value: 5,
                    message: 'Github URL must be at least 5 characters'
                  }
                }}
              />

              <HFInput
                control={control}
                name="resume_url"
                label="Resume URL"
                placeholder="Enter your resume url"
                required
                rules={{
                  required: 'Resume URL is required',
                  minLength: {
                    value: 5,
                    message: 'Resume URL must be at least 5 characters'
                  }
                }}
              />


              <HFInput
                control={control}
                name="role"
                label="Role"
                placeholder="User role"
                disabled // Role usually shouldn't be editable by user
                helperText="Role is managed by administrators"
              />

              <HFInput
                control={control}
                name="id"
                label="User ID"
                placeholder="User ID"
                disabled // ID should never be editable
                helperText="This is your unique identifier"
              />

              <HFImageUpload
                control={control}
                name="profilePicture"
                label="Profile Image"
                helperText="Upload a profile picture (PNG, JPG, GIF up to 5MB)"
                rules={{
                  required: false,
                }}
                defaultValue={userInfo.profilePicture || ''}
                maxSize={5}
              />

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={!isDirty || isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty || isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No user information available</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
