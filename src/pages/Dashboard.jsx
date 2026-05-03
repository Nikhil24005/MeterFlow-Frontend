import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Activity, AlertTriangle, Clock } from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await api.get('/billing/stats');
      return response.data.stats;
    },
  });

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

  const colors = ['#0ea5e9', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">Real-time API analytics & insights</p>
        </div>
        <div className="text-sm text-gray-400">
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
          <StatCard
            title="Requests Today"
            value={stats?.totalToday?.toLocaleString() || 0}
            subtitle="Last 24 hours"
            color="blue"
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <StatCard
            title="Requests This Month"
            value={stats?.totalMonth?.toLocaleString() || 0}
            subtitle="Month to date"
            color="green"
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <StatCard
            title="Error Rate"
            value={stats?.errorRate || '0%'}
            subtitle="4xx/5xx responses"
            color="red"
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <StatCard
            title="Avg Latency"
            value={stats?.avgLatency || '0ms'}
            subtitle="Response time"
            color="purple"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Requests per hour */}
        <div className="lg:col-span-2 card-hover p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary-900/30 rounded-lg">
              <Activity className="text-primary-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Requests per Hour</h2>
              <p className="text-sm text-gray-400">Last 24 hours</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={stats?.hourlyData || []}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
              <XAxis
                dataKey="_id"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#colorRequests)"
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Top endpoints */}
        <div className="card-hover p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-accent-900/30 rounded-lg">
              <TrendingUp className="text-accent-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Top Endpoints</h2>
              <p className="text-sm text-gray-400">By requests</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.topEndpoints || []}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {(stats?.topEndpoints || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Card */}
        <div className="card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-900/30 rounded-lg">
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">Performance</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Uptime</span>
              <span className="text-green-400 font-semibold">99.9%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-accent h-2 rounded-full" style={{ width: '99.9%' }}></div>
            </div>
            <p className="text-xs text-gray-500">Excellent uptime performance</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="card-hover p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <Clock className="text-blue-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white">System Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API Servers</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Operational</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Database</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Operational</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
