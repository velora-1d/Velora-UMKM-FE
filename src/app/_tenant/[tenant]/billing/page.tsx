'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, CreditCard } from 'lucide-react';
import apiClient from '@/lib/api';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, subscriptionRes] = await Promise.all([
        apiClient.get('/billing/plans'),
        apiClient.get('/billing/subscription')
      ]);
      setPlans(plansRes.data.plans || []);
      setCurrentPlan(subscriptionRes.data.subscription?.plan || 'free');
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      const response = await apiClient.post('/billing/payment', { amount: 99000 });
      window.open(response.data.payment_url, '_blank');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Payment failed');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your subscription and billing</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Current Plan</h2>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <CreditCard className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Your Current Plan</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{currentPlan}</div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className={`bg-white dark:bg-gray-800 border rounded-lg p-6 ${plan.id === currentPlan ? 'border-teal-500 ring-2 ring-teal-500' : 'border-gray-200 dark:border-gray-700'}`}>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                    <div className="mt-2">
                      {plan.price === 0 ? (
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">Free</span>
                      ) : (
                        <div>
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(plan.price)}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.id === currentPlan ? (
                    <button className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium cursor-default">Current Plan</button>
                  ) : (
                    <button onClick={() => handleUpgrade(plan.id)} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium">
                      {plan.price === 0 ? 'Start Free Trial' : 'Upgrade Now'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
