'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import apiClient from '@/lib/api';

interface Product {
  id: string;
  name: string;
  sku: string;
  selling_price: number;
  stock_quantity: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export default function NewSalesOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<OrderItem[]>([{ product_id: '', quantity: 1, unit_price: 0, subtotal: 0 }]);
  const [formData, setFormData] = useState({ customer_id: '', order_date: new Date().toISOString().split('T')[0], discount: 0, notes: '', status: 'draft' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, customersRes] = await Promise.all([apiClient.get('/products?limit=100'), apiClient.get('/customers?limit=100')]);
      setProducts(productsRes.data.products || []);
      setCustomers(customersRes.data.customers || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const addItem = () => setItems([...items, { product_id: '', quantity: 1, unit_price: 0, subtotal: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].unit_price = product.selling_price;
        newItems[index].subtotal = product.selling_price * newItems[index].quantity;
      }
    } else if (field === 'quantity' || field === 'unit_price') {
      newItems[index].subtotal = newItems[index].quantity * newItems[index].unit_price;
    }
    
    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal - formData.discount;
    return { subtotal, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validItems = items.filter(item => item.product_id && item.quantity > 0);
    if (validItems.length === 0) {
      setError('Please add at least one product');
      return;
    }

    if (!formData.customer_id) {
      setError('Please select a customer');
      return;
    }

    setSaving(true);
    try {
      await apiClient.post('/sales/orders', { ...formData, items: validItems });
      router.push('/sales/orders');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setSaving(false);
    }
  };

  const { subtotal, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/sales/orders')} className="text-gray-500 hover:text-gray-700"><ArrowLeft className="h-6 w-6" /></button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Sales Order</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new customer order</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => router.push('/sales/orders')} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-lg">
                <Save className="h-5 w-5" />
                {saving ? 'Saving...' : 'Save Order'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>}

        <form className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer <span className="text-red-500">*</span></label>
                <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500" required>
                  <option value="">Select Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Date</label>
                <input type="date" value={formData.order_date} onChange={(e) => setFormData({ ...formData, order_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500">
                  <option value="draft">Draft</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Items</h2>
              <button type="button" onClick={addItem} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm">
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Product</label>
                    <select value={item.product_id} onChange={(e) => updateItem(index, 'product_id', e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500">
                      <option value="">Select Product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Quantity</label>
                    <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)} min="1" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Price</label>
                    <input type="number" value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)} min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subtotal</label>
                    <div className="px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white">
                      Rp {item.subtotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-600 hover:text-red-900 dark:text-red-400" disabled={items.length === 1}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-end">
                <div className="w-full md:w-1/3 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-medium text-gray-900 dark:text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                    <input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })} min="0" className="w-32 px-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-teal-600">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h2>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500" placeholder="Order notes..." />
          </div>
        </form>
      </div>
    </div>
  );
}
