import React, { useEffect } from 'react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonColor = 'primary', 
  size = 'medium', 
}) => {

  if (!isOpen) return null;


  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

 
  const handleContentClick = (e) => {
    e.stopPropagation();
  };


  const buttonColors = {
    primary: 'bg-primary hover:bg-primary/90 text-cream',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  };


  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
  };

  const dialogSize = sizeClasses[size] || sizeClasses.medium;
  const confirmButtonStyle = buttonColors[confirmButtonColor] || buttonColors.primary;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`bg-cream rounded-lg shadow-xl ${dialogSize} w-full`}
        onClick={handleContentClick}
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
          <p className="text-gray-700 mb-6">{message}</p>
          
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-100 transition"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 ${confirmButtonStyle} font-medium rounded transition`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;