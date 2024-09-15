import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  const preferences = await request.json();
  
  if (!preferences.userId || typeof preferences.userId !== 'string') {
    return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
  }

  try {
    const docRef = db.collection('preferences').doc(preferences.userId);
    await docRef.set(preferences);
    return NextResponse.json({ message: 'Preferences saved successfully' });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
}

export default POST;
