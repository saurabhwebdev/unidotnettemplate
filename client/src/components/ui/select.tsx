import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
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
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2"
        style={{
          backgroundColor: colors.bgPrimary,
          color: value ? colors.textPrimary : colors.textMuted,
          border: `1px solid ${isOpen ? colors.primary : colors.border}`,
          boxShadow: isOpen ? `0 0 0 3px ${colors.primary}20` : '0 1px 2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: colors.textMuted }}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden transition-all duration-200 origin-top ${
          isOpen
            ? 'opacity-100 scale-y-100 translate-y-0'
            : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
        }`}
        style={{
          backgroundColor: colors.bgPrimary,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div className="py-1 max-h-60 overflow-y-auto">
          {/* Placeholder/Reset Option */}
          {placeholder && (
            <button
              type="button"
              onClick={() => handleSelect('')}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left"
              style={{
                color: colors.textMuted,
                backgroundColor: !value ? `${colors.primary}10` : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (value) e.currentTarget.style.backgroundColor = colors.bgHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = !value ? `${colors.primary}10` : 'transparent';
              }}
            >
              <span>{placeholder}</span>
              {!value && <Check className="w-4 h-4" style={{ color: colors.primary }} />}
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
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left"
                style={{
                  color: isSelected ? colors.primary : colors.textPrimary,
                  backgroundColor: isSelected ? `${colors.primary}10` : 'transparent',
                  fontWeight: isSelected ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = colors.bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected ? `${colors.primary}10` : 'transparent';
                }}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-4 h-4" style={{ color: colors.primary }} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
