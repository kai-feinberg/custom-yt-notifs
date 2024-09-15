import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const docRef = db.collection('preferences').doc(userId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Preferences not found' }, { status: 404 });
    }

    const preferencesData = docSnap.data();
    return NextResponse.json({ data: preferencesData }, { status: 200 });

  } catch (error) {
    console.error('Error retrieving preferences:', error);
    return NextResponse.json({ error: 'Error retrieving preferences' }, { status: 500 });
  }
}