import { ChevronDown } from 'lucide-react';
import { colors } from '../../config/theme.config';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string | undefined;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, options, placeholder, className = '' }: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2"
        style={{
          backgroundColor: colors.bgPrimary,
          color: value ? colors.textPrimary : colors.textMuted,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        }}
      >
        {placeholder && (
          <option value="" style={{ color: colors.textMuted }}>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={{
              backgroundColor: colors.bgPrimary,
              color: colors.textPrimary,
            }}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: colors.textMuted }}
      >
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
