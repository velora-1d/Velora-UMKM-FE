'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Business analytics and insights</p>
          </div>
          <div className="mt-6 flex gap-4">
            <button onClick={() => setReportType('sales')} className={`px-4 py-2 rounded-lg font-medium ${reportType === 'sales' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Sales</button>
            <button onClick={() => setReportType('stock')} className={`px-4 py-2 rounded-lg font-medium ${reportType === 'stock' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Stock</button>
            <button onClick={() => setReportType('profit')} className={`px-4 py-2 rounded-lg font-medium ${reportType === 'profit' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Profit</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reportType === 'sales' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Sales</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Rp 0</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Orders</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Avg Order</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Rp 0</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Customers</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5" />Sales Trend</h2>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">Chart will be displayed here</div>
            </div>
          </>
        )}

        {reportType === 'stock' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-teal-600" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Products</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Stock</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Stock Value</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Rp 0</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Low Stock</div>
                <div className="text-2xl font-bold text-amber-600">0</div>
              </div>
            </div>
          </>
        )}

        {reportType === 'profit' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">Rp 0</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Cost</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Rp 0</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-teal-600" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Gross Profit</div>
                    <div className="text-2xl font-bold text-teal-600">Rp 0</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Margin</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">0%</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
