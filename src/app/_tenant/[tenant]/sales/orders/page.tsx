'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api';

interface SalesOrder {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  order_date: string;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  created_at: string;
}

export default function SalesOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      const response = await apiClient.get(`/sales/orders?${params}`);
      setOrders(response.data.orders || []);
      setTotal(response.data.pagination?.total || 0);
      setTotalPages(response.data.pagination?.total_pages || 0);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await apiClient.delete(`/sales/orders/${id}`);
      setOrders(orders.filter(o => o.id !== id));
      setTotal(total - 1);
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  const handleConfirm = async (id: string) => {
    if (!confirm('Confirm this order? This will check stock availability.')) return;
    try {
      await apiClient.post(`/sales/orders/${id}/confirm`);
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'confirmed' } : o));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to confirm order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return badges[status] || badges.draft;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Orders</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage customer orders</p>
            </div>
            <button onClick={() => router.push('/sales/orders/new')} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
              <Plus className="h-5 w-5" />
              New Order
            </button>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500">
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No orders</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create your first sales order.</p>
            <button onClick={() => router.push('/sales/orders/new')} className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
              <Plus className="h-5 w-5" />
              New Order
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Draft</div>
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{orders.filter(o => o.status === 'draft').length}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Confirmed</div>
                <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'confirmed').length}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Value</div>
                <div className="text-2xl font-bold text-teal-600">{formatCurrency(orders.reduce((sum, o) => sum + o.total, 0))}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{order.order_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.customer_name || 'Customer'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(order.order_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'draft' && (
                            <button onClick={() => handleConfirm(order.id)} className="text-green-600 hover:text-green-900 dark:text-green-400" title="Confirm">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button onClick={() => router.push(`/sales/orders/${order.id}`)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400">View</button>
                          {order.status === 'draft' && (
                            <button onClick={() => router.push(`/sales/orders/${order.id}/edit`)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400">Edit</button>
                          )}
                          <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-900 dark:text-red-400">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} orders</div>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">Previous</button>
                    <span className="px-3 py-1">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
