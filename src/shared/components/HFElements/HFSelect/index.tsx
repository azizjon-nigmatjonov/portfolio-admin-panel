import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/utils/cn';

interface SelectOption {
  label: string;
  value: string;
}

interface HFSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  className?: string;
  options: SelectOption[];
  rules?: RegisterOptions<T>;
  handleChange?: (name: Path<T>, value: string) => void;
  defaultValue?: string;
}

export const HFSelect = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  helperText,
  className,
  options,
  rules,
  handleChange,
  defaultValue = '',
}: HFSelectProps<T>) => {
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
            <Select
              disabled={disabled}
              value={value || ''}
              onValueChange={(selectedValue) => {
                onChange(selectedValue);
                handleChange?.(name, selectedValue);
              }}
            >
              <SelectTrigger
                id={name}
                className={cn(
                  error && 'border-red-500 focus:ring-red-500'
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
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



