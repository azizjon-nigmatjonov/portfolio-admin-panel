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
  role: string;
  id: string;
  profilePicture?: File | string;
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
      role: '',
      id: '',
      profilePicture: ''
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
        profilePicture: userInfo.profilePicture || ''
      });
    }
  }, [userInfo, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updateData: any = {
        name: data.name,
        email: data.email
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
