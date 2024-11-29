'use client';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ProtectedPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    toast('Validating...', { duration: 1000 });
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (data.valid) {
        toast.success('API key is valid!', {
          duration: 3000,
          position: 'top-center',
          icon: '✅',
        });
      } else {
        toast.error('Invalid API key!', {
          duration: 3000,
          position: 'top-center',
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error during validation:', error);
      toast.error('Error validating API key', {
        duration: 3000,
        position: 'top-center',
        icon: '⚠️',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">API Key Validation</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              Enter API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              placeholder="Enter your API key"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Validating...' : 'Validate Key'}
          </button>
        </form>
      </div>
    </div>
  );
} 