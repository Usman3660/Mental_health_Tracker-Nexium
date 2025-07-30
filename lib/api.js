const { createClient } = require('@supabase/supabase-js');
const { MongoClient } = require('mongodb');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('Missing Supabase environment variables. Check .env.local');
  throw new Error('Supabase configuration error');
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_KEY);
const mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

async function handleLogin(email) {
  try {
    console.log('Sending magic link for:', email);
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        redirectTo: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/auth/callback' : 'https://your-vercel-url/auth/callback',
      },
    });
    if (error) {
      console.error('Login error:', error.message, error.details);
      throw error;
    }
    console.log('Magic link sent, data:', data);
    return data;
  } catch (error) {
    console.error('HandleLogin error:', error);
    throw error;
  }
}

async function saveJournalEntry(userId, entryData, insights) {
  try {
    const { data, error } = await supabase.from('journal_entries').insert({
      user_id: userId,
      title: entryData.title,
      content: entryData.content,
      insights,
      created_at: new Date(),
    });
    if (error) throw error;
    if (data) {
      await mongoClient.connect();
      await mongoClient.db('mindtrack').collection('entries').insertOne({
        user_id: userId,
        title: entryData.title,
        content: entryData.content,
        insights,
        created_at: new Date(),
      });
      await mongoClient.close();
    }
    return { data, error };
  } catch (error) {
    throw error;
  }
}

async function analyzeEntry(entry) {
  if (!process.env.GROK_API_KEY) throw new Error('Missing Grok API key');
  // If fetch is not defined (Node.js), import it
  if (typeof fetch === 'undefined') {
    global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  }
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: `Analyze this journal and give insights on this: ${entry}` }],
        max_tokens: 150,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Grok API error: ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Grok API response format unexpected: ' + JSON.stringify(data));
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Grok analyzeEntry error:', error);
    throw error;
  }
}

module.exports = { handleLogin, saveJournalEntry, analyzeEntry };