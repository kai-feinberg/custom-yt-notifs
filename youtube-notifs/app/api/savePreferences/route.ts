// /pages/api/savePreferences.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Import the Firebase Admin SDK setup

export async function POST(request: Request) {
  const preferences = await request.json();

  // Validate the request body to ensure a userId is provided
  if (!preferences.userId || typeof preferences.userId !== 'string') {
    return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
  }

  try {
    // Add the preferences to the Firestore 'preferences' collection
    const docRef = await db.collection('preferences').add(preferences); // Admin SDK `add()` method

    return NextResponse.json({ message: 'Preferences added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error adding preferences:', error);
    return NextResponse.json({ error: 'Failed to add preferences' }, { status: 500 });
  }
}
