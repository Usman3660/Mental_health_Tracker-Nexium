import { useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../lib/supabase';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('Callback triggered, full URL:', window.location.href);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        console.log('Found tokens in hash, attempting session exchange...');
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        console.log('Session exchange result:', data, 'Error:', error);
        if (error) {
          console.error('Session exchange failed:', error.message);
          router.push('/login?error=Session exchange failed');
          return;
        }
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Final session check:', sessionData, 'Error:', sessionError);
      if (sessionError || !sessionData.session) {
        console.error('No valid session:', sessionError?.message || 'No session');
        router.push('/login?error=Authentication failed');
      } else {
        console.log('Redirecting to dashboard with session:', sessionData.session.user.email);
        router.push('/dashboard');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>Processing authentication, please wait...</p>
    </div>
  );
}