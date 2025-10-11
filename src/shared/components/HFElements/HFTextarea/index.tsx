import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/utils/cn';

interface HFTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  className?: string;
  rows?: number;
  rules?: RegisterOptions<T>;
  handleChange?: (name: Path<T>, value: string) => void;
  defaultValue?: string;
}

export const HFTextarea = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  helperText,
  className,
  rows = 4,
  rules,
  handleChange,
  defaultValue = '',
}: HFTextareaProps<T>) => {
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={name} className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue as any}
        rules={{
          required: required ? `${label || 'This field'} is required` : undefined,
          ...rules,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <Textarea
              id={name}
              placeholder={placeholder}
              value={value || ''}
              disabled={disabled}
              rows={rows}
              className={cn(
                error && 'border-red-500 focus-visible:ring-red-500'
              )}
              onChange={(e) => {
                const inputValue = e.target.value;
                onChange(inputValue);
                handleChange?.(name, inputValue);
              }}
            />
            
            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 mt-1">{error.message}</p>
            )}
            
            {/* Helper Text */}
            {helperText && !error && (
              <p className="text-sm text-gray-500 mt-1">{helperText}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};



