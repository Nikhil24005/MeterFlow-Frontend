import { useState } from 'react';

export default function KeyDisplay({ apiKey, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 w-full max-w-md">
      <h2 className="text-xl font-bold text-white mb-4">API Key Generated</h2>

      <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
        <p className="text-red-200 text-sm font-medium mb-2">⚠️ Important</p>
        <p className="text-red-100 text-xs">
          Copy your API key now. You won't be able to see it again for security reasons.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            API Key
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiKey.key}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-xs"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Plan</p>
            <p className="text-white capitalize">{apiKey.planType}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Rate Limit</p>
            <p className="text-white">{apiKey.rateLimit}/hr</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}
