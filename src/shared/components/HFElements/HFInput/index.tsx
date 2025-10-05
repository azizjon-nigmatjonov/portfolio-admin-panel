import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Input } from '@/shared/components/Input';

interface HFInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  className?: string;
  rules?: RegisterOptions<T>;
  handleChange?: (name: Path<T>, value: string) => void;
  defaultValue?: string;
}

export const HFInput = <T extends FieldValues>({
  control,
  name,
  type = 'text',
  label,
  placeholder,
  disabled = false,
  required = false,
  helperText,
  className,
  rules,
  handleChange,
  defaultValue = '',
}: HFInputProps<T>) => {
  return (
    <div className={className}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue as any}
        rules={{
          ...rules,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            type={type}
            label={label}
            placeholder={placeholder}
            value={value || ''}
            disabled={disabled}
            required={required}
            error={error?.message}
            helperText={helperText}
            onChange={(inputValue: string) => {
              onChange(inputValue);
              handleChange?.(name, inputValue);
            }}
          />
        )}
      />
    </div>
  );
};
