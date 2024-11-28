'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, PencilIcon, TrashIcon, ClipboardIcon, BeakerIcon, XMarkIcon, Spinner } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import EditKeyModal from '@/components/modals/EditKeyModal';
import DeleteKeyModal from '@/components/modals/DeleteKeyModal';
import KeyActions from '@/components/KeyActions';
import { apiKeyService } from '@/services/apiKeyService';

export default function NewDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState(null);
  const [editName, setEditName] = useState('');
  const [usageLimit] = useState(1000); // Set your desired limit
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKeyData, setEditingKeyData] = useState(null);
  const [editLimit, setEditLimit] = useState(1000);
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [loading, setLoading] = useState(false); // Add loading state
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true); // Set loading to true before fetching
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false); // Set loading to false after fetching
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const keys = await apiKeyService.fetchKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (e) => {
    e.preventDefault();
    try {
      const newKey = await apiKeyService.createKey({ 
        name: newKeyName,
        usage_limit: limitEnabled ? editLimit : null
      });
      
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName('');
      setShowNewKeyForm(false);
    } catch (error) {
      console.error('Error creating API key:', error);
      alert(error.message || 'Failed to create API key');
    }
  };

  const handleDeleteClick = (key) => {
    setKeyToDelete(key);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (keyToDelete) {
      setIsDeleting(true);
      try {
        await apiKeyService.deleteKey(keyToDelete.id);
        setApiKeys(apiKeys.filter(key => key.id !== keyToDelete.id));
      } catch (error) {
        console.error('Error deleting API key:', error);
        alert(error.message || 'Failed to delete API key');
      } finally {
        setIsDeleting(false);
        setShowDeleteModal(false);
        setKeyToDelete(null);
      }
    }
  };

  const logKeyData = (key) => {
    console.log('Key data:', {
      id: key.id,
      name: key.name,
      key: key.key,
      limit: key.limit
    });
  };

  const startEditing = (key) => {
    console.log('Starting edit for key:', key);
    setEditingKeyData({
      id: key.id,
      name: key.name,
      key: key.key,
      limit: key.usage_limit
    });
    
    setEditName(key.name);
    setEditLimit(key.usage_limit || 1000);
    setLimitEnabled(!!key.usage_limit);
    setShowEditModal(true);
  };

  const copyToClipboard = async (text, keyId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleUpdateKey = async () => {
    if (!editingKeyData?.id) return;

    setIsEditing(true);
    try {
      const updateData = {
        name: editName,
        usage_limit: limitEnabled ? editLimit : null,
        key: editingKeyData.key
      };
      
      await apiKeyService.updateKey(editingKeyData.id, updateData);
      await fetchApiKeys();
    } catch (error) {
      console.error('Error updating API key:', error);
      alert(error.message || 'Failed to update API key');
    } finally {
      setIsEditing(false);
      setShowEditModal(false);
      setEditingKeyData(null);
      setEditName('');
      setEditLimit(1000);
      setLimitEnabled(false);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const LoadingModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-700 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100 p-8">
      {loading && <LoadingModal />}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm text-gray-600 mb-1">Pages / Overview</div>
              <h1 className="text-4xl font-bold text-gray-900">Overview</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
              <button className="p-2 rounded-full bg-white shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* API Usage Meter */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">API Limit</h2>
              <div className="text-sm text-gray-500">
                <span className="font-medium">{apiKeys.length}</span>/{usageLimit} Requests
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(apiKeys.length / usageLimit) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">API Keys</h2>
                <button
                  onClick={() => {
                    setShowNewKeyForm(true);
                    setNewKeyName('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <span>+</span> New Key
                </button>
              </div>
              
              {showNewKeyForm && (
                <form onSubmit={createApiKey} className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeyName || ''}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Enter key name"
                      className="border border-gray-300 rounded-lg px-3 py-2 flex-1 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewKeyForm(false);
                        setNewKeyName('');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 shadow-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <p className="text-gray-600 mt-2">
                The key is used to authenticate your requests to the Research API.
              </p>
            </div>

            {/* API Keys Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((key) => key && (
                    <tr key={key?.id || 'fallback-key'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {key?.name || 'Unnamed Key'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">23</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-gray-600 font-mono">
                          {visibleKeys.has(key.id) ? `dk_${key?.key}` : '••••••••••••••••'}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <KeyActions 
                          keyData={key}
                          isVisible={visibleKeys.has(key.id)}
                          isCopied={copiedKey === key.id}
                          onToggleVisibility={toggleKeyVisibility}
                          onCopy={(key) => copyToClipboard(`dk_${key.key}`, key.id)}
                          onEdit={startEditing}
                          onDelete={handleDeleteClick}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DeleteKeyModal 
        isOpen={showDeleteModal}
        keyToDelete={keyToDelete}
        onClose={() => {
          setShowDeleteModal(false);
          setKeyToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
      <EditKeyModal 
        isOpen={showEditModal}
        keyData={editingKeyData}
        onClose={() => {
          setShowEditModal(false);
          setEditingKeyData(null);
        }}
        onSave={handleUpdateKey}
        editName={editName}
        setEditName={setEditName}
        editLimit={editLimit}
        setEditLimit={setEditLimit}
        limitEnabled={limitEnabled}
        setLimitEnabled={setLimitEnabled}
        isLoading={isEditing}
      />
    </div>
  );
} 