import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Modal container */}
      <div 
        className="relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 hover:bg-gray-800/50 rounded-lg transition-smooth text-gray-400 hover:text-white"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        {children}
      </div>
    </div>
  );
}
