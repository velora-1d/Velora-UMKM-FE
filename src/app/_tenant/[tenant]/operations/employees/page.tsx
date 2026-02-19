'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import apiClient from '@/lib/api';

interface Employee {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  status: string;
}

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/operations/employees?page=${page}&limit=20`);
      setEmployees(response.data.employees || []);
      setTotal(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await apiClient.delete(`/operations/employees/${id}`);
      setEmployees(employees.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your team members</p>
            </div>
            <button onClick={() => router.push('/operations/employees/new')} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
              <Plus className="h-5 w-5" />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No employees</h3>
            <button onClick={() => router.push('/operations/employees/new')} className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
              <Plus className="h-5 w-5" />
              Add Employee
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Employees</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
                <div className="text-2xl font-bold text-green-600">{employees.filter(e => e.status === 'active').length}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {employees.map((emp) => (
                <div key={emp.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{emp.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{emp.position}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'}`}>{emp.status}</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {emp.phone && <p>📱 {emp.phone}</p>}
                    {emp.email && <p>✉️ {emp.email}</p>}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => router.push(`/operations/employees/${emp.id}/edit`)} className="flex-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-sm">Edit</button>
                    <button onClick={() => handleDelete(emp.id)} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
