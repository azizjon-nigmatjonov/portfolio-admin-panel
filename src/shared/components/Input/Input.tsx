import React, { forwardRef } from 'react';
import type { InputProps } from '@/shared/types/common.types';
import { cn } from '@/shared/utils/cn';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  label,
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  error,
  helperText,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  className,
  ...props
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
