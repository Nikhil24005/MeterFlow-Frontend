import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import StatCard from '../components/StatCard';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/stats');
      return response.data.stats;
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get('/admin/users');
      return response.data.users;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          subtitle="Registered users"
          color="blue"
        />
        <StatCard
          title="Requests Today"
          value={stats?.totalRequestsToday || 0}
          subtitle="Platform-wide"
          color="green"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats?.activeSubscriptions || 0}
          subtitle="Pro plan users"
          color="purple"
        />
        <StatCard
          title="MRR"
          value={stats?.mrrAmount || '₹0'}
          subtitle="Monthly revenue"
          color="orange"
        />
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Role</th>
                <th className="px-6 py-3 text-left font-medium">Plan</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {usersData?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700 transition">
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 text-gray-300 capitalize">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 text-gray-300 capitalize">
                    {user.plan}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        user.subscriptionStatus === 'active'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {user.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
