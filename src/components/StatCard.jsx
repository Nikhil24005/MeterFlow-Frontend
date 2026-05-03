import { TrendingUp, AlertCircle, Clock, Zap, AlertTriangle } from 'lucide-react';

export default function StatCard({ title, value, subtitle, color = 'blue' }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-900/30',
      border: 'border-blue-700/50',
      text: 'text-blue-400',
      icon: Zap,
      gradient: 'from-blue-600 to-cyan-600',
    },
    green: {
      bg: 'bg-green-900/30',
      border: 'border-green-700/50',
      text: 'text-green-400',
      icon: TrendingUp,
      gradient: 'from-green-600 to-emerald-600',
    },
    red: {
      bg: 'bg-red-900/30',
      border: 'border-red-700/50',
      text: 'text-red-400',
      icon: AlertCircle,
      gradient: 'from-red-600 to-pink-600',
    },
    orange: {
      bg: 'bg-orange-900/30',
      border: 'border-orange-700/50',
      text: 'text-orange-400',
      icon: AlertTriangle,
      gradient: 'from-orange-600 to-yellow-600',
    },
    purple: {
      bg: 'bg-purple-900/30',
      border: 'border-purple-700/50',
      text: 'text-purple-400',
      icon: Clock,
      gradient: 'from-purple-600 to-pink-600',
    },
  };

  const config = colorMap[color] || colorMap.blue;
  const Icon = config.icon;

  return (
    <div className={`relative group card-hover overflow-hidden ${config.bg} ${config.border}`}>
      {/* Background gradient glow */}
      <div className={`absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br ${config.gradient} opacity-5 rounded-full blur-3xl transition-all duration-500 group-hover:opacity-10`}></div>
      
      {/* Icon background */}
      <div className="absolute top-4 right-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <Icon className={`${config.text}`} size={24} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <p className="text-gray-400 text-sm font-medium mb-3">{title}</p>
        <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {value}
        </h3>
        <p className={`text-sm ${config.text}`}>{subtitle}</p>
      </div>

      {/* Bottom accent bar */}
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
    </div>
  );
}
