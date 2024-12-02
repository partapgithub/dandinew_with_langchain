'use client';
import { useState } from 'react';
import PhoneVerification from '@/components/PhoneVerification';

export default function GitHubSummarizer() {
  const [isVerified, setIsVerified] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isVerified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Verify Your Phone</h1>
        <PhoneVerification onVerified={setIsVerified} />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ githubUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch summary');
      }

      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">GitHub Repository Summarizer</h1>
      
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 mb-8">
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium mb-1">
            GitHub Repository URL
          </label>
          <input
            type="url"
            id="githubUrl"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Repository'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {summary && (
        <div className="bg-orange-900 text-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="mb-4">{summary.summary}</p>
          
          <h3 className="text-lg font-semibold mb-2">Cool Facts</h3>
          <ul className="list-disc pl-5">
            {summary.cool_facts.map((fact, index) => (
              <li key={index} className="mb-1">{fact}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 