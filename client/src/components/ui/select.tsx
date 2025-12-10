import { useState, useRef, useEffect } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || placeholder || 'Select...';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-sm focus:outline-none"
        style={{
          backgroundColor: colors.bgPrimary,
          color: value ? colors.textPrimary : colors.textMuted,
          border: `1px solid ${colors.border}`,
        }}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown
          className={`w-3 h-3 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: colors.textMuted }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-0"
          style={{
            backgroundColor: colors.bgPrimary,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="max-h-60 overflow-y-auto">
            {/* Placeholder/Reset Option */}
            {placeholder && (
              <button
                type="button"
                onClick={() => handleSelect('')}
                className="w-full px-3 py-1.5 text-sm text-left"
                style={{
                  color: colors.textMuted,
                  backgroundColor: !value ? colors.bgSecondary : 'transparent',
                  borderBottom: `1px solid ${colors.border}`,
                }}
                onMouseEnter={(e) => {
                  if (value) e.currentTarget.style.backgroundColor = colors.bgSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = !value ? colors.bgSecondary : 'transparent';
                }}
              >
                {placeholder}
              </button>
            )}

            {/* Options */}
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="w-full px-3 py-1.5 text-sm text-left"
                  style={{
                    color: colors.textPrimary,
                    backgroundColor: isSelected ? colors.bgSecondary : 'transparent',
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = colors.bgSecondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isSelected ? colors.bgSecondary : 'transparent';
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
