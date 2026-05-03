import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function Badge({ label, variant = 'gray' }) {
  const variantMap = {
    success: {
      bg: 'bg-green-900/30',
      text: 'text-green-300',
      border: 'border-green-700/50',
      icon: CheckCircle,
    },
    danger: {
      bg: 'bg-red-900/30',
      text: 'text-red-300',
      border: 'border-red-700/50',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-orange-900/30',
      text: 'text-orange-300',
      border: 'border-orange-700/50',
      icon: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-900/30',
      text: 'text-blue-300',
      border: 'border-blue-700/50',
      icon: Info,
    },
    gray: {
      bg: 'bg-gray-700/50',
      text: 'text-gray-300',
      border: 'border-gray-600/50',
      icon: null,
    },
  };

  const config = variantMap[variant] || variantMap.gray;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border transition-smooth ${config.bg} ${config.text} ${config.border}`}
    >
      {Icon && <Icon size={14} />}
      {label}
    </span>
  );
}
