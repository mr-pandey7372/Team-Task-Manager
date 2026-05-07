import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  
  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
  };

  const iconColors = {
    danger: 'text-red-600 bg-red-100',
    warning: 'text-yellow-600 bg-yellow-100',
    info: 'text-blue-600 bg-blue-100'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="sm:flex sm:items-start mb-6">
        <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${iconColors[type]}`}>
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <p className="text-sm text-gray-500">
            {message}
          </p>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
        <button
          type="button"
          className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto transition-colors ${buttonColors[type]}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
          onClick={onClose}
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
