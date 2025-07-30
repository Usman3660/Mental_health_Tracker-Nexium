import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';

export default function Journal() {
  const [title, setTitle] = useState('');
  const [entry, setEntry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [insight, setInsight] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
      else {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('title, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        if (error) console.error('Error fetching entries:', error);
        else setRecentEntries(data);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, entry, userId: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        setInsight(data.insights);
        setTitle('');
        setEntry('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Head>
        <title>MindTrack - Journal</title>
      </Head>
      <div className="w-1/4 bg-white p-4 shadow-md hidden md:block">
        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
        <div className="space-y-2">
          {recentEntries.map((entry) => (
            <div key={entry.id} className="p-2 border rounded flex justify-between items-center">
              <span>{entry.title || 'Untitled'}</span>
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-3/4 p-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry Title"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write your journal entry"
            className="w-full p-2 mb-4 border rounded h-48"
            rows="12"
            required
          />
          <button type="submit" className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center justify-center" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Analyzing with AI...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.5 9a1 1 0 100 2h7a1 1 0 100-2h-7z"></path>
                </svg>
                Save & Analyze
              </>
            )}
          </button>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </form>
        {insight && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6 w-full max-w-lg text-center">
            <h3 className="text-xl font-semibold mb-2">AI Insight</h3>
            <p className="text-gray-700 whitespace-pre-line">{insight}</p>
            <button
              className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
              onClick={() => router.push('/insights')}
            >
              Go to All Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
}