import { EyeIcon, ClipboardIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function KeyActions({ 
  keyData, 
  isVisible,
  isCopied,
  onToggleVisibility, 
  onCopy,
  onEdit,
  onDelete 
}) {
  return (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={() => onToggleVisibility(keyData.id)}
        className="p-1 hover:bg-gray-100 rounded relative group"
        title={isVisible ? "Hide API key" : "Show API key"}
      >
        <EyeIcon 
          className={`w-4 h-4 ${isVisible ? 'text-blue-600' : 'text-gray-400'}`}
        />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isVisible ? 'Hide API key' : 'Show API key'}
        </span>
      </button>
      <button
        onClick={() => onCopy(keyData)}
        className="p-1 hover:bg-gray-100 rounded flex-shrink-0 relative group"
      >
        {isCopied ? (
          <div className="text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        ) : (
          <ClipboardIcon className="w-4 h-4 text-gray-500 hover:text-blue-600" />
        )}
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isCopied ? 'Copied!' : 'Copy to clipboard'}
        </span>
      </button>
      <button
        onClick={() => onEdit(keyData)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <PencilIcon className="w-4 h-4 text-blue-600" />
      </button>
      <button
        onClick={() => onDelete(keyData)}
        className="p-1 hover:bg-gray-100 rounded text-red-600"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
} 