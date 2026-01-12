import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-[#1F2933] mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          block w-full rounded-md border-[#E3DDD6] shadow-sm 
          focus:border-[#5B2C2C] focus:ring-1 focus:ring-[#5B2C2C] sm:text-sm 
          px-3 py-2 border
          disabled:bg-[var(--color-paper-soft)] disabled:text-[var(--color-text-muted)]
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
