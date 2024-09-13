// /pages/api/getPreferences.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      const docRef = doc(db, 'notifications', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        res.status(200).json(docSnap.data());
      } else {
        res.status(404).json({ error: 'No preferences found for this user' });
      }
    } catch (error) {
      console.error('Error retrieving preferences:', error);
      res.status(500).json({ error: 'Error retrieving preferences' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
