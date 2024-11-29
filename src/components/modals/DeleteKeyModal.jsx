import { XMarkIcon } from '@heroicons/react/24/outline';
import LoadingOverlay from '../LoadingOverlay';

export default function DeleteKeyModal({ isOpen, keyToDelete, onClose, onConfirm, isLoading }) {
  if (!isOpen || !keyToDelete) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[480px] shadow-lg rounded-md bg-white">
        {isLoading && <LoadingOverlay message="Deleting key..." />}
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-gray-900">
            Delete API Key &apos;{keyToDelete.name}&apos;
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-600 text-lg">
            Are you sure you want to delete this API key? It will be invalidated and you will need to update it in your applications.
          </p>
          <p className="text-gray-600 mt-4 font-medium">
            This action is irreversible.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 