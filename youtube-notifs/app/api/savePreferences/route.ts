// /pages/api/savePreferences.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, channelId, searchQuery } = req.body;

    try {
      // Create or update a document in the "notifications" collection
      await setDoc(doc(db, 'notifications', userId), {
        channelId: channelId,
        searchQuery: searchQuery,
        lastChecked: new Date(),
      });
      res.status(200).json({ message: 'Preferences saved successfully!' });
    } catch (error) {
      console.error('Error saving preferences:', error);
      res.status(500).json({ error: 'Error saving preferences' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
