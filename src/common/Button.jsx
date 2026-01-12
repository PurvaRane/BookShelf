import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#5B2C2C] text-white hover:bg-[#3F1E1E] focus:ring-[#5B2C2C]',
    secondary: 'bg-white text-[#1F2933] border border-[#E3DDD6] hover:bg-[#FAF7F3] focus:ring-[#5B2C2C]',
    outline: 'bg-transparent border border-[#5B2C2C] text-[#5B2C2C] hover:bg-[#5B2C2C]/5 focus:ring-[#5B2C2C]',
    ghost: 'bg-transparent text-[#6B6A67] hover:bg-[#FAF7F3] hover:text-[#1F2933] focus:ring-[#5B2C2C]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
