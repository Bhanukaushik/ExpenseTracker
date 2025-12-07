import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}, ref) => {
  const baseStyles = 'rounded-2xl shadow-sm border border-gray-200 overflow-hidden';
  
  const variants = {
    default: 'bg-white hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300',
    gradient: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white border-transparent shadow-xl hover:shadow-2xl hover:scale-[1.02]',
    glass: 'bg-white/60 backdrop-blur-xl border-white/50 shadow-2xl hover:shadow-3xl'
  };

  return (
    <div 
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
