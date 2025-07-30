import { saveJournalEntry, analyzeEntry } from '../../lib/api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }


  let { title, entry, userId } = req.body;
  if (!entry) {
    return res.status(400).json({ success: false, message: 'Entry is required' });
  }
  if (!title) title = 'Untitled';
  if (!userId) userId = 'anonymous';

  try {
    const insights = await analyzeEntry(entry);
    const saveData = await saveJournalEntry(userId, { title, content: entry }, insights);
    res.status(200).json({ success: true, insights, saveData });
  } catch (error) {
    console.error('Journal Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}