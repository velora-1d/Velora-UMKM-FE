'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, LogOut } from 'lucide-react';
import apiClient from '@/lib/api';

interface Attendance {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [todayStats, setTodayStats] = useState({ present: 0, late: 0, absent: 0 });
  const [loading, setLoading] = useState(true);
  const [checkInId, setCheckInId] = useState('');
  const [checkOutId, setCheckOutId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        apiClient.get('/operations/attendance/today'),
        apiClient.get('/operations/attendance?page=1&limit=20')
      ]);
      const today = todayRes.data.attendance || [];
      setAttendance(today);
      setTodayStats({
        present: today.filter((a: any) => a.check_in).length,
        late: 0,
        absent: 0
      });
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!checkInId) return;
    try {
      await apiClient.post('/operations/attendance/check-in', { employee_id: checkInId, notes: '' });
      alert('Check-in successful!');
      setCheckInId('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    if (!checkOutId) return;
    try {
      await apiClient.post('/operations/attendance/check-out', { employee_id: checkOutId, notes: '' });
      alert('Check-out successful!');
      setCheckOutId('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Check-out failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track employee attendance</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Present Today</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{todayStats.present}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Today's Check-In/Out</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Check-In Employee</label>
                  <select value={checkInId} onChange={(e) => setCheckInId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">Select Employee</option>
                    <option value="emp1">Employee 1</option>
                    <option value="emp2">Employee 2</option>
                  </select>
                  <button onClick={handleCheckIn} className="mt-2 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Check-In</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Check-Out Employee</label>
                  <select value={checkOutId} onChange={(e) => setCheckOutId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">Select Employee</option>
                    <option value="emp1">Employee 1</option>
                    <option value="emp2">Employee 2</option>
                  </select>
                  <button onClick={handleCheckOut} className="mt-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Check-Out</button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Check-In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Check-Out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{att.employee_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(att.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{att.check_in ? new Date(att.check_in).toLocaleTimeString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{att.check_out ? new Date(att.check_out).toLocaleTimeString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{att.status}</span></td>
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
