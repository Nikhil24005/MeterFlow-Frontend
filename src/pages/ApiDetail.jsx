import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import KeyDisplay from '../components/KeyDisplay';
import Table from '../components/Table';

export default function ApiDetail() {
  const { id } = useParams();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKey, setNewKey] = useState(null);

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['api', id],
    queryFn: async () => {
      const response = await api.get(`/apis/${id}`);
      return response.data.api;
    },
  });

  const { data: keysData, refetch: refetchKeys } = useQuery({
    queryKey: ['keys', id],
    queryFn: async () => {
      const response = await api.get('/keys');
      return response.data.keys?.filter((k) => k.apiId._id === id) || [];
    },
  });

  const generateKeyMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/apis/${id}/keys`, { apiId: id });
      return response.data.apiKey;
    },
    onSuccess: (data) => {
      setNewKey(data);
      setShowKeyModal(true);
      refetchKeys();
    },
  });

  const revokeKeyMutation = useMutation({
    mutationFn: async (keyId) => {
      await api.patch(`/keys/${keyId}/revoke`);
    },
    onSuccess: () => {
      refetchKeys();
    },
  });

  const rotateKeyMutation = useMutation({
    mutationFn: async (keyId) => {
      const response = await api.patch(`/keys/${keyId}/rotate`);
      return response.data.newApiKey;
    },
    onSuccess: (data) => {
      setNewKey(data);
      setShowKeyModal(true);
      refetchKeys();
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* API Info */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2">{apiData?.name}</h1>
        <p className="text-gray-400 mb-4">{apiData?.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Base URL</p>
            <p className="text-white font-mono text-xs break-all">
              {apiData?.baseUrl}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Status</p>
            <Badge
              label={apiData?.isActive ? 'Active' : 'Inactive'}
              variant="success"
            />
          </div>
          <div>
            <p className="text-gray-400">Created</p>
            <p className="text-white">
              {new Date(apiData?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">API Keys</h2>
          <button
            onClick={() => generateKeyMutation.mutate()}
            disabled={generateKeyMutation.isPending}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            Generate New Key
          </button>
        </div>

        <Table
          columns={[
            { key: 'key', label: 'Key' },
            { key: 'planType', label: 'Plan' },
            { key: 'rateLimit', label: 'Rate Limit' },
            { key: 'createdAt', label: 'Created' },
            { key: 'actions', label: 'Actions' },
          ]}
          data={
            keysData?.map((k) => ({
              ...k,
              createdAt: new Date(k.createdAt).toLocaleDateString(),
              actions: (
                <div className="flex gap-2">
                  <button
                    onClick={() => revokeKeyMutation.mutate(k.id)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
                  >
                    Revoke
                  </button>
                  <button
                    onClick={() => rotateKeyMutation.mutate(k.id)}
                    className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition"
                  >
                    Rotate
                  </button>
                </div>
              ),
            })) || []
          }
        />
      </div>

      {/* Key Display Modal */}
      <Modal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)}>
        {newKey && <KeyDisplay apiKey={newKey} onClose={() => setShowKeyModal(false)} />}
      </Modal>
    </div>
  );
}
