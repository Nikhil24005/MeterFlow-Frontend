import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Zap, Settings, Trash2 } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';

export default function Apis() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseUrl: '',
  });
  const [error, setError] = useState('');

  const { data: apisData, isLoading, refetch } = useQuery({
    queryKey: ['apis'],
    queryFn: async () => {
      const response = await api.get('/apis');
      return response.data.apis;
    },
  });

  const handleCreateApi = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/apis', formData);
      setFormData({ name: '', description: '', baseUrl: '' });
      setShowModal(false);
      refetch();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create API');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-accent rounded-full blur-md opacity-20"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 border-r-primary-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            APIs
          </h1>
          <p className="text-gray-400">Manage and monitor your API endpoints</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={20} />
          Create API
        </button>
      </div>

      {/* Empty State */}
      {apisData?.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-block p-6 bg-gray-800/50 rounded-full mb-4">
            <Zap size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No APIs yet</h3>
          <p className="text-gray-400 mb-6">Create your first API to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create API
          </button>
        </div>
      )}

      {/* APIs Grid */}
      {apisData?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {apisData?.map((apiItem, index) => (
            <div
              key={apiItem._id}
              className="group card-hover overflow-hidden cursor-pointer transition-all animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/apis/${apiItem._id}`)}
            >
              {/* Header with gradient */}
              <div className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-6">
                {/* Title and Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors mb-1">
                      {apiItem.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {apiItem.description || 'No description provided'}
                    </p>
                  </div>
                  <div className="p-3 bg-primary-900/30 rounded-lg group-hover:bg-primary-900/50 transition-colors">
                    <Zap className="text-primary-400" size={20} />
                  </div>
                </div>

                {/* URL Section */}
                <div className="py-4 px-3 bg-gray-800/50 rounded-lg border border-gray-700 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Base URL</p>
                  <p className="text-sm text-primary-400 font-mono truncate">
                    {apiItem.baseUrl}
                  </p>
                </div>

                {/* Metadata */}
                <div className="space-y-3 text-sm text-gray-400 mb-4">
                  <p>
                    <span className="text-gray-500">Created:</span>{' '}
                    <span className="text-white font-medium">
                      {new Date(apiItem.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <Badge label={apiItem.isActive ? 'Active' : 'Inactive'} variant="success" />
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/apis/${apiItem._id}`);
                      }}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-smooth"
                      title="Settings"
                    >
                      <Settings size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create API Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="card w-full max-w-md">
          <div className="h-1 bg-gradient-accent"></div>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-accent rounded-lg">
                <Zap size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create API</h2>
            </div>

            <form onSubmit={handleCreateApi} className="space-y-5">
              {/* API Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  API Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-base"
                  placeholder="My Awesome API"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-base resize-none"
                  placeholder="Describe what this API does..."
                  rows="3"
                />
              </div>

              {/* Base URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Base URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.baseUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, baseUrl: e.target.value })
                  }
                  className="input-base"
                  placeholder="https://api.example.com/v1"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Must be a valid URL starting with https://
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm flex gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create API
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
