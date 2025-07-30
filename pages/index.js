import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [email, setEmail] = useState('');
  const [entry, setEntry] = useState('');
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash) {
      console.log('Hash detected on root, redirecting to dashboard with hash:', window.location.hash);
      router.push('/dashboard' + window.location.hash);
    }
  }, [router]);

  const handleLoginAndSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, entry }),
      });
      const data = await response.json();
      if (data.success) {
        setInsights(data.insights);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Head>
        <title>MindTrack</title>
      </Head>
      <nav className="flex justify-between items-center p-6 bg-white shadow-md">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-purple-600">❤️ MindTrack</span>
        </div>
        <div className="space-x-4">
          <a href="#" className="text-gray-600 hover:text-purple-600">Home</a>
          <a href="#" className="text-gray-600 hover:text-purple-600">Features</a>
          <a href="#" className="text-gray-600 hover:text-purple-600">Journal</a>
          <a href="#" className="text-gray-600 hover:text-purple-600">Insights</a>
        </div>
        <Link href="/login">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Start Journey</button>
        </Link>
      </nav>

      <section className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Understand Your Mind, One Entry at a Time</h1>
        <p className="text-lg text-gray-600 mb-6">AI-powered journal analysis for mental clarity and wellness</p>
        <form className="max-w-md mx-auto">
          
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write your journal entry"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <Link href="/login">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
              Start Journaling
            </button>
          </Link>
        </form>
        {insights && (
          <div className="mt-6 p-4 bg-white rounded shadow-md">
            <h3 className="text-xl font-semibold">AI Insights:</h3>
            <p>{JSON.stringify(insights)}</p>
          </div>
        )}
        {error && <p className="mt-4 text-red-600">{error}</p>}
        <div className="mt-6 flex justify-center space-x-4">
          <span>😊</span><span>🙂</span><span>🤓</span><span>AI</span>
        </div>
      
      </section>

      <section className="py-16 px-4 bg-purple-50">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How it Works</h2>
        <div className="flex justify-around flex-wrap">
          <div className="w-64 p-6 bg-white rounded-lg shadow-md text-center">
            <img src="/images/journalentry.jpeg" alt="Write" className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Write Your Journal</h3>
            <p className="text-gray-600">Record your thoughts and feelings daily.</p>
          </div>
          <div className="w-64 p-6 bg-white rounded-lg shadow-md text-center">
            <img src="/images/aianalyze.png" alt="AI Analyze" className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold">AI Analyzes Mood Patterns</h3>
            <p className="text-gray-600">Get deep insights from your entries.</p>
          </div>
          <div className="w-64 p-6 bg-white rounded-lg shadow-md text-center">
            <img src="/images/tips.png" alt="Insights" className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Receive Insights & Tips</h3>
            <p className="text-gray-600">Personalized wellness tips based on AI analysis.</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Testimonials</h2>
        <div className="flex justify-around flex-wrap">
          <div className="w-64 p-6 bg-white rounded-lg shadow-md text-center">
            <p className="text-gray-600 italic">"Amazing tool for self-reflection!"</p>
            <p className="mt-2 font-semibold">- Jane Doe</p>
          </div>
        </div>
      </section>
    </div>
  );
}