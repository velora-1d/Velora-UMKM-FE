'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Wallet } from 'lucide-react';
import apiClient from '@/lib/api';

interface Product {
  id: string;
  name: string;
  sku: string;
  selling_price: number;
  stock_quantity: number;
}

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export default function POSPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/pos/products?limit=50');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        price: product.selling_price,
        quantity: 1,
        subtotal: product.selling_price
      }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.product_id === productId 
        ? { ...item, quantity, subtotal: item.price * quantity }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calculateChange = () => {
    const total = calculateTotal();
    return paymentMethod === 'cash' ? cashReceived - total : 0;
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    const total = calculateTotal();
    if (paymentMethod === 'cash' && cashReceived < total) {
      alert('Insufficient cash received');
      return;
    }

    setProcessing(true);
    try {
      await apiClient.post('/pos/transaction', {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.price
        })),
        discount: 0,
        payment: {
          method: paymentMethod,
          amount: paymentMethod === 'cash' ? cashReceived : total
        }
      });
      
      // Show success and redirect
      alert('Transaction completed successfully!');
      setCart([]);
      setCashReceived(0);
      fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Transaction failed');
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = calculateTotal();
  const change = calculateChange();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Left Panel - Products */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Point of Sale</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Quick transaction processing</p>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-teal-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">SKU: {product.sku}</div>
                  <div className="text-sm font-bold text-teal-600 mt-2">Rp {product.selling_price.toLocaleString('id-ID')}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stock: {product.stock_quantity}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{cart.length} items</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>Cart is empty</p>
                <p className="text-sm mt-2">Click products to add</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product_id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Rp {item.price.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.product_id)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium">Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total:</span>
              <span className="text-teal-600">Rp {total.toLocaleString('id-ID')}</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center justify-center gap-2 p-2 rounded-lg border ${paymentMethod === 'cash' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <Banknote className="h-4 w-4" />
                  <span className="text-xs">Cash</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`flex items-center justify-center gap-2 p-2 rounded-lg border ${paymentMethod === 'bank_transfer' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs">Transfer</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('ewallet')}
                  className={`flex items-center justify-center gap-2 p-2 rounded-lg border ${paymentMethod === 'ewallet' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <Wallet className="h-4 w-4" />
                  <span className="text-xs">E-Wallet</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'cash' && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cash Received</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  placeholder="0"
                />
                {change > 0 && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Change: Rp {change.toLocaleString('id-ID')}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={processing || cart.length === 0}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold rounded-lg transition-colors"
            >
              {processing ? 'Processing...' : `Pay Rp ${total.toLocaleString('id-ID')}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
