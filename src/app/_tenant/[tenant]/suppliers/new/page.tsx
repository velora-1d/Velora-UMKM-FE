'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import apiClient from '@/lib/api';

export default function NewSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = params.id !== undefined;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    status: 'active',
  });

  useEffect(() => {
    if (isEdit) {
      fetchSupplier();
    }
  }, [isEdit]);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/suppliers/${params.id}`);
      const data = response.data.data;
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        notes: data.notes || '',
        status: data.status || 'active',
      });
    } catch (error) {
      console.error('Failed to fetch supplier:', error);
      setError('Failed to load supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEdit) {
        await apiClient.put(`/suppliers/${params.id}`, formData);
      } else {
        await apiClient.post('/suppliers', formData);
      }
      router.push('/suppliers');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to save supplier';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/suppliers')} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? 'Edit Supplier' : 'New Supplier'}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {isEdit ? 'Update supplier information' : 'Add a new supplier'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => router.push('/suppliers')} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <X className="h-5 w-5" />
                Cancel
              </button>
              <button onClick={(e) => handleSubmit(e)} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-lg transition-colors">
                <Save className="h-5 w-5" />
                {saving ? 'Saving...' : 'Save Supplier'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supplier Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter supplier name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="supplier@example.com" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="081234567890" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Street address" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Jakarta" />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Additional notes about the supplier" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
