import { forwardRef, useEffect } from 'react';
import Button from './Button';

const Modal = forwardRef(({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  ...props 
}, ref) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div 
      ref={ref}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200"
      role="dialog"
      aria-modal="true"
      {...props}
    >
      <div className={`bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto ${sizes[size]} w-full animate-in slide-in-from-bottom-4 duration-200 max-w-full mx-4`}>
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 pb-12">
          {children}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white z-10 border-t border-gray-200 px-8 py-6 rounded-b-3xl flex gap-3 justify-end">
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={onClose}
            className="px-8"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;
