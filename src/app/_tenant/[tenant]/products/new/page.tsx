'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import apiClient from '@/lib/api';

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  unit: string;
  selling_price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock: number;
  status: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = params.id !== undefined;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    unit: 'pcs',
    selling_price: 0,
    cost_price: 0,
    stock_quantity: 0,
    min_stock: 10,
    status: 'active',
  });

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [isEdit]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/products/${params.id}`);
      const data = response.data.data;
      setProduct(data);
      setFormData({
        sku: data.sku || '',
        name: data.name || '',
        description: data.description || '',
        unit: data.unit || 'pcs',
        selling_price: data.selling_price || 0,
        cost_price: data.cost_price || 0,
        stock_quantity: data.stock_quantity || 0,
        min_stock: data.min_stock || 10,
        status: data.status || 'active',
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Failed to load product');
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
        await apiClient.put(`/products/${params.id}`, formData);
      } else {
        await apiClient.post('/products', formData);
      }
      router.push('/products');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to save product';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
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
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/products')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? 'Edit Product' : 'New Product'}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {isEdit ? 'Update product information' : 'Add a new product to your catalog'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/products')}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
              <button
                onClick={(e) => handleSubmit(e)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                <Save className="h-5 w-5" />
                Save Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                  placeholder="e.g., PROD-001"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Product description"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selling Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                  <input
                    type="number"
                    id="selling_price"
                    name="selling_price"
                    value={formData.selling_price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cost Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                  <input
                    type="number"
                    id="cost_price"
                    name="cost_price"
                    value={formData.cost_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="gram">Grams (gram)</option>
                  <option value="liter">Liters (liter)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="box">Boxes (box)</option>
                </select>
              </div>

              <div>
                <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Initial Stock
                </label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="min_stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Stock
                </label>
                <input
                  type="number"
                  id="min_stock"
                  name="min_stock"
                  value={formData.min_stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Status
            </h2>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
