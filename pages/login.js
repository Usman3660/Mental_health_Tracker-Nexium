import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const text = await response.text();
        let errorMsg = '';
        try {
          const errObj = JSON.parse(text);
          if (
            errObj?.error &&
            errObj.error.includes('For security purposes, you can only request this after')
          ) {
            errorMsg = 'Please wait a minute before requesting another magic link.';
          } else {
            errorMsg = errObj.error || response.statusText;
          }
        } catch {
          errorMsg = text || response.statusText;
        }
        setMessage(errorMsg);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Head>
        <title>MindTrack - Login</title>
      </Head>
      <div className="bg-[#A68CC2] p-8 rounded-2xl">
        <div className="bg-[#FAF9FB] border-2 border-gray-100 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <img src="/images/logo.png" alt="MindTrack Logo" className="w-16 h-16 mb-2" />
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">
              Log in to track your mental wellness
            </p>
            {/* Brain Illustration */}
            <img
              src="/images/mind.png"
              alt="Brain Illustration"
              className="w-20 h-20 mt-4"
            />
          </div>

          <form onSubmit={handleLogin} className="mt-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full p-3 rounded-lg bg-white text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
            <button
              type="submit"
              className="w-full mt-4 bg-purple-700 text-white font-medium py-3 rounded-full shadow-md hover:bg-purple-800 transition"
            >
              Sign in with magic link
            </button>
          </form>

          {message && <p className="text-sm text-gray-600 mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
}