import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  const { userId, fcmToken } = await request.json();

  if (!userId || !fcmToken) {
    return NextResponse.json({ error: 'User ID and FCM token are required' }, { status: 400 });
  }

  try {
    // Reference to the users collection
    const usersRef = db.collection('users');

    // Update or create the user document with the FCM token
    await usersRef.doc(userId).set({
      fcmToken: fcmToken
    }, { merge: true });

    return NextResponse.json({ message: 'FCM token stored successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error storing FCM token:', error);
    return NextResponse.json({ error: 'Failed to store FCM token' }, { status: 500 });
  }
}