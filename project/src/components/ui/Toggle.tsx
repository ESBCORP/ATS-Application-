import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label
}) => {
  const sizes = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className="flex items-center">
      <button
        role="switch"
        aria-checked={checked}
        className={`
          relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2
          focus:ring-blue-500 focus:ring-offset-2 ${
            checked ? 'bg-blue-600' : 'bg-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${sizes[size]}
        `}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'}
            ${
              checked
                ? size === 'sm'
                  ? 'translate-x-4'
                  : size === 'lg'
                  ? 'translate-x-7'
                  : 'translate-x-5'
                : 'translate-x-0'
            }
          `}
        />
      </button>
      {label && (
        <span className="ml-2 text-sm text-gray-900">{label}</span>
      )}
    </div>
  );
};

export default Toggle;