import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { cn } from '@/shared/utils/cn';

interface HFImageUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  className?: string;
  rules?: RegisterOptions<T>;
  handleChange?: (name: Path<T>, value: File | null) => void;
  defaultValue?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export const HFImageUpload = <T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  required = false,
  helperText,
  className,
  rules,
  handleChange,
  defaultValue = '',
  accept = 'image/*',
  maxSize = 5, // 5MB default
}: HFImageUploadProps<T>) => {
  const [preview, setPreview] = useState<string | null>(defaultValue);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (file: File | null, onChange: (value: any) => void) => {
    if (file) {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onChange(file);
    handleChange?.(name, file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, onChange: (value: any) => void) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0], onChange);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue as any}
        rules={rules}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div className="space-y-2">
            {/* Upload Area */}
            <div
              className={cn(
                'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                dragOver
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400',
                error && 'border-red-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, onChange)}
            >
              <input
                type="file"
                accept={accept}
                disabled={disabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null, onChange)}
              />
              
              {preview ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 w-32 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Click to change or drag and drop a new image
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to {maxSize}MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600">{error.message}</p>
            )}
            
            {/* Helper Text */}
            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};
