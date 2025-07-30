import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInsights = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { data, error } = await supabase
        .from('journal_entries')
        .select('id, title, insights, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setInsights(data || []);
      setLoading(false);
    };
    fetchInsights();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Head>
        <title>MindTrack - All Insights</title>
      </Head>
      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center">All AI Insights</h2>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {insights.length === 0 && !loading && <p className="text-center">No insights found.</p>}
        <div className="space-y-6">
          {insights.map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{entry.title || 'Untitled'}</span>
                <span className="text-gray-400 text-sm">{new Date(entry.created_at).toLocaleString()}</span>
              </div>
              <div className="mt-2">
                <span className="block text-gray-700 whitespace-pre-line">{entry.insights || 'No insight generated.'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}