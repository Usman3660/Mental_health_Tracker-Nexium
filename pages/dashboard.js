import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [recentEntries, setRecentEntries] = useState([])
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        const { data, error } = await supabase
          .from('journal_entries')
          .select('id, title, content, created_at, mood_score')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(3)

        if (error) console.error('Error fetching entries:', error)
        else setRecentEntries(data || [])
      }
    }
    checkSession()
  }, [router])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getMoodColor = (score) => {
    if (!score) return 'bg-gray-300'
    if (score >= 7) return 'bg-green-500'
    if (score >= 4) return 'bg-yellow-400'
    return 'bg-red-500'
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#f9f9fb] font-sans text-gray-800">
      <Head>
        <title>MindTrack - Dashboard</title>
      </Head>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="MindTrack Logo" className="w-9 h-8" />
            <span className="font-semibold text-xl">MindTrack</span>
          </div>
          <div className="hidden md:flex space-x-6 text-sm">
            <a href="/" className="hover:underline">Home</a>
            <a href="/journal" className="hover:underline">Journal</a>
            <a href="/insights" className="hover:underline">Insights</a>
            <a href="/dashboard" className="hover:underline">Dashboard</a>
          </div>
          <div className="text-sm text-gray-600">
            {user?.email}
            <button onClick={handleSignOut} className="ml-4 text-blue-600 hover:underline">
              Sign out
            </button>
          </div>
        </div>

        {/* Greeting */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          {getGreeting()}, {user?.email?.split('@')[0]}!
        </h1>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* New Entry */}
          <a href="/journal" className="bg-purple-100 hover:bg-purple-200 rounded-lg p-5 text-center shadow-sm transition">
            <img src="/images/newentry.png" alt="New Entry" className="mx-auto mb-3 w-8 h-8" />
            <h2 className="font-semibold text-purple-800">New Entry</h2>
            <p className="text-xs text-purple-700">Start a New Entry</p>
          </a>

          {/* AI Insights with Gradient */}
          <a
            href="/insights"
            className="bg-gradient-to-br from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300 rounded-lg p-5 text-center shadow-md transition duration-300"
          >
            <img src="/images/insight.png" alt="AI Insights" className="mx-auto mb-3 w-8 h-8" />
            <h2 className="font-semibold text-teal-800">AI Insights</h2>
            <p className="text-xs text-teal-700">View AI Insights</p>
          </a>

          {/* Mood Trends with Gradient */}
          <a
            href="/dashboard"
            className="bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 rounded-lg p-5 text-center shadow-md transition duration-300"
          >
            <img src="/images/trend.png" alt="Mood Trends" className="mx-auto mb-3 w-8 h-8" />
            <h2 className="font-semibold text-amber-800">Mood Trends</h2>
            <p className="text-xs text-amber-700">Track Your Mood</p>
          </a>
        </div>

        {/* Recent Entries & Wellness */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Entries */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Recent Entries</h3>
            {recentEntries.length === 0 ? (
              <p>No recent entries found.</p>
            ) : (
              <ul className="space-y-3">
                {recentEntries.map((entry) => (
                  <li key={entry.id} className="flex justify-between items-start border-b pb-2">
                    <div>
                      <p className="font-semibold">{entry.title || 'Untitled'}</p>
                      <p className="text-xs text-gray-500">{new Date(entry.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`w-3 h-3 rounded-full mt-1 ${getMoodColor(entry.mood_score)}`}></span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 text-right">
              <a href="/journal" className="text-sm text-blue-600 hover:underline">View All Entries</a>
            </div>
          </div>

          {/* Daily Wellness */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Daily Wellness</h3>
            <p className="text-sm text-gray-600 mb-3">
              Practice deep breathing exercises to help reduce stress and center your thoughts when feeling overwhelmed.
            </p>
            <img src="/images/wellness.jpeg" alt="Wellness" className="w-full max-w-xs mx-auto" />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} MindTrack
        </div>
      </div>
    </div>
  )
}
