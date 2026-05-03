import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Playground() {
  const [selectedApiId, setSelectedApiId] = useState('');
  const [selectedKeyId, setSelectedKeyId] = useState('');
  const [endpoint, setEndpoint] = useState('/');
  const [queryParams, setQueryParams] = useState('');
  const [requestBody, setRequestBody] = useState('{}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: apis } = useQuery({
    queryKey: ['apis'],
    queryFn: async () => {
      const response = await api.get('/apis');
      return response.data.apis;
    },
  });

  const { data: keys } = useQuery({
    queryKey: ['keys', selectedApiId],
    enabled: !!selectedApiId,
    queryFn: async () => {
      const response = await api.get('/keys');
      return response.data.keys?.filter((k) => k.apiId._id === selectedApiId) || [];
    },
  });

  const handleSendRequest = async () => {
    if (!selectedApiId || !selectedKeyId) {
      setError('Please select an API and API key');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      // Get the full API key value (we need to fetch it)
      const keyResponse = await api.get(`/keys/${selectedKeyId}/stats`);
      
      // Build URL
      let url = `/gateway${endpoint}`;
      if (queryParams) {
        url += `?${queryParams}`;
      }

      // Make request with API key header
      const startTime = Date.now();
      
      const requestConfig = {
        method: 'GET',
        headers: {
          'x-api-key': keyResponse.data.stats.keyId, // This won't work, we need the full key
        },
      };

      if (requestBody && requestBody.trim() !== '{}') {
        requestConfig.method = 'POST';
        requestConfig.data = JSON.parse(requestBody);
      }

      const res = await api(url, requestConfig);
      const latency = Date.now() - startTime;

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        body: res.data,
        latency,
      });
    } catch (err) {
      const latency = Date.now() - (parseInt(Date.now()));
      setResponse({
        status: err.response?.status || 500,
        statusText: err.response?.statusText || 'Error',
        headers: err.response?.headers || {},
        body: err.response?.data || { error: err.message },
        latency: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">API Playground</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Builder */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Request</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select API
                </label>
                <select
                  value={selectedApiId}
                  onChange={(e) => {
                    setSelectedApiId(e.target.value);
                    setSelectedKeyId('');
                  }}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose an API...</option>
                  {apis?.map((api) => (
                    <option key={api._id} value={api._id}>
                      {api.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select API Key
                </label>
                <select
                  value={selectedKeyId}
                  onChange={(e) => setSelectedKeyId(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  disabled={!selectedApiId}
                >
                  <option value="">Choose a key...</option>
                  {keys?.map((key) => (
                    <option key={key.id} value={key.id}>
                      {key.key}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Endpoint Path
                </label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="/users"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Query Parameters
                </label>
                <input
                  type="text"
                  value={queryParams}
                  onChange={(e) => setQueryParams(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="page=1&limit=10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Request Body (JSON)
                </label>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  rows="6"
                  placeholder='{"key": "value"}'
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSendRequest}
                disabled={loading}
                className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>

        {/* Response Viewer */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Response</h2>

            {response ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Status</p>
                    <p
                      className={`text-lg font-semibold ${
                        response.status < 300
                          ? 'text-green-400'
                          : response.status < 400
                          ? 'text-blue-400'
                          : 'text-red-400'
                      }`}
                    >
                      {response.status} {response.statusText}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Latency</p>
                    <p className="text-lg font-semibold text-white">
                      {response.latency}ms
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-xs mb-2">Response Body</p>
                  <pre className="bg-gray-900 border border-gray-700 rounded p-3 text-xs text-gray-300 overflow-x-auto max-h-64">
                    {JSON.stringify(response.body, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No response yet. Send a request to see results.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
