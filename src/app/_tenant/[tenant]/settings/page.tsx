'use client';

import { useState } from 'react';
import { User, Building2, Lock, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [preferences, setPreferences] = useState({ businessName: '', currency: 'IDR', timezone: 'Asia/Jakarta' });

  const handleSaveProfile = async () => {
    alert('Profile saved!');
  };

  const handleSavePreferences = async () => {
    alert('Preferences saved!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full sm:w-64 flex-shrink-0">
            <nav className="space-y-1">
              <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'profile' ? 'bg-teal-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <User className="h-5 w-5" />
                Profile
              </button>
              <button onClick={() => setActiveTab('business')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'business' ? 'bg-teal-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <Building2 className="h-5 w-5" />
                Business
              </button>
              <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'security' ? 'bg-teal-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <Lock className="h-5 w-5" />
                Security
              </button>
              <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${activeTab === 'notifications' ? 'bg-teal-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <Bell className="h-5 w-5" />
                Notifications
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                    <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <button onClick={handleSaveProfile} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Business Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
                    <input type="text" value={preferences.businessName} onChange={(e) => setPreferences({ ...preferences, businessName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                    <select value={preferences.currency} onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="IDR">IDR - Indonesian Rupiah</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                    <select value={preferences.timezone} onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                      <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                      <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                    </select>
                  </div>
                  <button onClick={handleSavePreferences} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                    <input type="password" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input type="password" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                    <input type="password" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium">Change Password</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
