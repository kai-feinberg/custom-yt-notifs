// /pages/api/getPreferences.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  // Validate that a userId is provided
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Query the 'preferences' collection for all documents where 'userId' matches the provided userId
    const preferencesRef = db.collection('preferences');
    const q = preferencesRef.where('userId', '==', userId);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return NextResponse.json({ data: [], message: 'No preferences found for this user' }, { status: 200 });
    }

    // Map over the documents and return an array of preference objects
    const preferences = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: preferences }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving preferences:', error);
    return NextResponse.json({ error: 'Error retrieving preferences' }, { status: 500 });
  }
}
