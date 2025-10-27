'use client';

import { useState } from 'react';
import { signup } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const res = await signup(email, password, hospitalName);
      console.log("✅ Signup success:", res);

      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }

      // ✅ Success messages
      if (res.new_hospital) {
        setAlert(`🎉 Hospital "${res.user.hospital_name}" registered successfully!`);
      } else {
        setAlert(`🏥 Added under existing hospital: "${res.user.hospital_name}". Welcome!`);
      }

      // Auto-redirect after showing success
      setTimeout(() => router.push('/'), 1800);
    } catch (err: any) {
      console.error("❌ Signup error:", err);

      // ✅ Detect backend "Email already registered"
      let message = "❌ Signup failed. Please try again.";
      const backendMessage = err?.message || "";

      if (backendMessage.includes("Email already registered")) {
        message = "⚠️ This email is already registered. Please log in instead.";
      }

      setAlert(message);

      // Optional: auto-redirect to login for already-registered case
      if (message.startsWith("⚠️")) {
        setTimeout(() => router.push('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Alert Message */}
      {alert && (
        <div
          className={`mb-6 p-3 rounded-lg text-center font-medium shadow-md transition-all duration-300 ${
            alert.startsWith('🎉')
              ? 'bg-green-100 text-green-800'
              : alert.startsWith('🏥')
              ? 'bg-blue-100 text-blue-800'
              : alert.startsWith('⚠️')
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {alert}
        </div>
      )}

      <form
        onSubmit={handleSignup}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <label className="block mb-2 text-sm font-medium">Hospital Name</label>
        <input
          type="text"
          value={hospitalName}
          onChange={(e) => setHospitalName(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-6 focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-medium py-2 rounded-md transition ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
