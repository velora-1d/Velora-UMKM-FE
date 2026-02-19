'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  issue_date: string;
  due_date: string;
  status: string;
  total: number;
  amount_paid: number;
  amount_due: number;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchInvoices();
  }, [page, statusFilter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: page.toString(), limit: '20' });
      const response = await apiClient.get(`/sales/invoices?${params}`);
      setInvoices(response.data.invoices || []);
      setTotal(response.data.pagination?.total || 0);
      setTotalPages(response.data.pagination?.total_pages || 0);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
    };
    return badges[status] || badges.pending;
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage customer invoices</p>
            </div>
            <button onClick={() => router.push('/sales/invoices/new')} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
              <Plus className="h-5 w-5" />
              New Invoice
            </button>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices</h3>
            <button onClick={() => router.push('/sales/invoices/new')} className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
              <Plus className="h-5 w-5" />
              New Invoice
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Invoices</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Unpaid</div>
                <div className="text-2xl font-bold text-yellow-600">{invoices.filter(i => i.status === 'pending').length}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Paid</div>
                <div className="text-2xl font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Outstanding</div>
                <div className="text-2xl font-bold text-teal-600">{formatCurrency(invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount_due, 0))}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Invoice No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Issue Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{invoice.invoice_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{invoice.customer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(invoice.issue_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(invoice.due_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>{invoice.status}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{formatCurrency(invoice.total)}</div>
                        {invoice.status !== 'paid' && <div className="text-xs text-red-600 dark:text-red-400">Due: {formatCurrency(invoice.amount_due)}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => router.push(`/sales/invoices/${invoice.id}`)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 mr-3">View</button>
                        {invoice.status !== 'paid' && <button onClick={() => router.push(`/sales/payments/new?invoice=${invoice.id}`)} className="text-green-600 hover:text-green-900 dark:text-green-400">Record Payment</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
