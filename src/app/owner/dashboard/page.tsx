'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import apiClient from '@/lib/api';

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState({
    total_tenants: 0,
    active_tenants: 0,
    mrr: 0,
    total_revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await apiClient.get('/owner/dashboard');
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Owner Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Platform overview and analytics</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Tenants</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_tenants}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Active Tenants</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active_tenants}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">MRR</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.mrr)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.total_revenue)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Tenants</h2>
                <div className="text-gray-500 dark:text-gray-400 text-sm">No recent tenants</div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Revenue Trend</h2>
                <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">Chart will be displayed here</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
