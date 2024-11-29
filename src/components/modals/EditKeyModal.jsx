import { XMarkIcon } from '@heroicons/react/24/outline';
import LoadingOverlay from '../LoadingOverlay';

export default function EditKeyModal({ 
  isOpen, 
  keyData, 
  onClose, 
  onSave,
  editName,
  setEditName,
  editLimit,
  setEditLimit,
  limitEnabled,
  setLimitEnabled,
  isLoading
}) {
  if (!isOpen || !keyData) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[480px] shadow-lg rounded-md bg-white">
        {isLoading && <LoadingOverlay message="Updating key..." />}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Edit API key
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Enter a new limit for the API key.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Name — A unique name to identify this key
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="default"
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={limitEnabled}
                onChange={(e) => setLimitEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Limit monthly usage*
              </label>
            </div>
            {limitEnabled && (
              <input
                type="number"
                value={editLimit}
                onChange={(e) => setEditLimit(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000"
              />
            )}
          </div>

          <p className="text-sm text-gray-500">
            * If the combined usage of all your keys exceeds your plan limit, all requests will be rejected.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 