import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';

export default function Billing() {
  const { data: currentBill } = useQuery({
    queryKey: ['current-bill'],
    queryFn: async () => {
      const response = await api.get('/billing/current');
      return response.data.billing;
    },
  });

  const { data: history } = useQuery({
    queryKey: ['billing-history'],
    queryFn: async () => {
      const response = await api.get('/billing/history');
      return response.data.bills;
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await api.get('/payments/subscription');
      return response.data.subscription;
    },
  });

  const handleUpgrade = async () => {
    try {
      const response = await api.post('/payments/checkout');
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Billing</h1>

      {/* Plan Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-700">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-100 text-sm mb-1">Current Plan</p>
            <h2 className="text-2xl font-bold text-white capitalize">
              {currentBill?.plan || 'free'} Plan
            </h2>
          </div>
          {currentBill?.plan === 'free' && (
            <button
              onClick={handleUpgrade}
              className="px-6 py-2 bg-white hover:bg-blue-50 text-blue-900 font-semibold rounded-lg transition"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* Current Month Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Requests This Month"
          value={currentBill?.totalRequests || 0}
          subtitle="Total API calls"
          color="blue"
        />
        <StatCard
          title="Billable Requests"
          value={currentBill?.billableRequests || 0}
          subtitle="Above free tier"
          color="orange"
        />
        <StatCard
          title="Amount Due"
          value={`₹${(currentBill?.amountRupees || 0).toFixed(2)}`}
          subtitle="Current period"
          color="green"
        />
      </div>

      {/* Billing History */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Billing History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Period</th>
                <th className="px-6 py-3 text-right font-medium">Requests</th>
                <th className="px-6 py-3 text-right font-medium">Amount</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
                <th className="px-6 py-3 text-center font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {history?.map((bill) => (
                <tr key={bill._id} className="hover:bg-gray-700 transition">
                  <td className="px-6 py-4 text-gray-300">{bill.period}</td>
                  <td className="px-6 py-4 text-gray-300 text-right">
                    {bill.totalRequests}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-right">
                    ₹{(bill.amount / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      label={bill.status}
                      variant={
                        bill.status === 'paid'
                          ? 'success'
                          : bill.status === 'pending'
                          ? 'warning'
                          : 'danger'
                      }
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {bill.stripeInvoiceId ? (
                      <a
                        href={`https://invoice.stripe.com/${bill.stripeInvoiceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {subscription?.currentPeriodEnd && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-300 text-sm">
            Next billing date:{' '}
            <span className="font-semibold text-white">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
