'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string; hospital_name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Account Details
        </h1>

        {user ? (
          <>
            <div className="text-left mb-6 space-y-2">
              <p className="text-gray-700">
                <strong>Hospital:</strong> {user.hospital_name || '—'}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Back to Patients
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Loading account...</p>
        )}
      </div>
    </div>
  );
}
