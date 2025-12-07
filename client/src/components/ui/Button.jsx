import { forwardRef } from 'react';

const Button = forwardRef(({
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = 'font-semibold rounded-xl focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 inline-flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500 border border-blue-600 hover:border-blue-700',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 border border-gray-300 hover:border-gray-400',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 border border-red-600 hover:border-red-700',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:ring-green-500 border border-green-600 hover:border-green-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900 focus:ring-gray-500 border border-transparent hover:border-gray-200'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14'
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
