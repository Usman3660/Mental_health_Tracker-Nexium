import { handleLogin } from '../../lib/api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    console.log('Attempting login with email:', email);
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key:', process.env.SUPABASE_KEY ? 'Set' : 'Not set');
    const data = await handleLogin(email);
    console.log('Login response data:', data);
    res.status(200).json({ success: true, message: 'Magic link sent. Check your email.' });
  } catch (error) {
    console.error('Login Error:', error.message, error.stack || {});
    res.status(500).json({ success: false, error: error.message });
  }
}