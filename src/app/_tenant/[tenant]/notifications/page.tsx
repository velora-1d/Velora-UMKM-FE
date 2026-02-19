'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, AlertCircle, Info, ShoppingCart, Package } from 'lucide-react';
import apiClient from '@/lib/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications?page=1&limit=50');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'sales': return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case 'inventory': return <Package className="h-5 w-5 text-amber-600" />;
      case 'alert': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.is_read) : notifications;
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-teal-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{unreadCount} unread notifications</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleMarkAllAsRead} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <CheckCheck className="h-5 w-5" />
                Mark All Read
              </button>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>All</button>
            <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-lg font-medium ${filter === 'unread' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Unread</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notif) => (
              <div key={notif.id} className={`bg-white dark:bg-gray-800 border rounded-lg p-4 ${!notif.is_read ? 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`text-sm font-semibold ${!notif.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{notif.title}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{notif.message}</p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">{new Date(notif.created_at).toLocaleString()}</p>
                      </div>
                      {!notif.is_read && (
                        <button onClick={() => handleMarkAsRead(notif.id)} className="flex-shrink-0 p-2 text-teal-600 hover:text-teal-700">
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
