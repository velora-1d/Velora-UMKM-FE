'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle, Building, User, Package, ClipboardList } from 'lucide-react';
import apiClient from '@/lib/api';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    subdomain: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiClient.post('/onboarding/complete', {
        business_name: formData.businessName,
        subdomain: formData.subdomain,
        owner_name: formData.ownerName,
        owner_email: formData.ownerEmail,
        owner_password: formData.ownerPassword,
      });
      alert('Onboarding completed! Please check your email for login details.');
      router.push('/auth/login');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Onboarding failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Step {step} of 4</span>
            <span className="text-sm text-gray-500 dark:text-gray-500">{Math.round((step / 4) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="h-2 bg-teal-600 rounded-full transition-all" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-teal-100 dark:bg-teal-900/30 mb-6">
              <CheckCircle className="h-10 w-10 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to VeloraERP!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Let's set up your business in just a few minutes.</p>
            <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Step 2: Business Info */}
        {step === 2 && (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Building className="h-6 w-6 text-teal-600" />
              Business Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
                <input type="text" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Your Business Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subdomain</label>
                <div className="flex">
                  <input type="text" value={formData.subdomain} onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })} className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="yourbusiness" />
                  <span className="px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-600 dark:text-gray-400">.velora.id</span>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Owner Account */}
        {step === 3 && (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <User className="h-6 w-6 text-teal-600" />
              Owner Account
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                <input type="text" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Your Full Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" value={formData.ownerEmail} onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input type="password" value={formData.ownerPassword} onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="••••••••" />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(2)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">Back</button>
                <button onClick={() => setStep(4)} className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Launch!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Your business account will be created with the following details:</p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8 text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">Business: <span className="font-semibold text-gray-900 dark:text-white">{formData.businessName}</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Subdomain: <span className="font-semibold text-gray-900 dark:text-white">{formData.subdomain}.velora.id</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Owner: <span className="font-semibold text-gray-900 dark:text-white">{formData.ownerName}</span></p>
            </div>
            <button onClick={handleSubmit} disabled={loading} className="w-full px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-lg font-semibold">
              {loading ? 'Creating Account...' : 'Complete Setup'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
