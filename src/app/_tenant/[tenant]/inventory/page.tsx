'use client';

import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import apiClient from '@/lib/api';

export default function InventoryPage() {
  const [summary, setSummary] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, lowStockRes] = await Promise.all([
        apiClient.get('/inventory/summary'),
        apiClient.get('/inventory/low-stock')
      ]);
      setSummary(summaryRes.data.summary);
      setLowStock(lowStockRes.data.products || []);
    } catch (error) {
      console.error('Failed to fetch inventory data:', error);
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track and manage your stock</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
        ) : summary ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-teal-600" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Products</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total_products}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Stock</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total_stock}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Stock Value</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.total_value)}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-amber-600" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Low Stock Items</div>
                    <div className="text-2xl font-bold text-amber-600">{summary.low_stock_count}</div>
                  </div>
                </div>
              </div>
            </div>

            {lowStock.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Low Stock Alert
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {lowStock.slice(0, 6).map((product: any) => (
                    <div key={product.id} className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">SKU: {product.sku}</div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-amber-600 font-bold">
                          {product.stock_quantity} {product.unit}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Min: {product.min_stock}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <div className="font-medium text-gray-900 dark:text-white">Stock In</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add stock from supplier</div>
                </button>
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <div className="font-medium text-gray-900 dark:text-white">Stock Out</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Remove stock (damage/loss)</div>
                </button>
                <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <div className="font-medium text-gray-900 dark:text-white">Stock Adjustment</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manual stock correction</div>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Failed to load inventory data</p>
          </div>
        )}
      </div>
    </div>
  );
}
