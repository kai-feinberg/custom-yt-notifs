import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const fcmToken = userData?.fcmToken;

    if (!fcmToken) {
      return NextResponse.json({ error: 'FCM token not found for this user' }, { status: 404 });
    }

    return NextResponse.json({ fcmToken }, { status: 200 });
  } catch (error) {
    console.error('Error fetching FCM token:', error);
    return NextResponse.json({ error: 'Failed to fetch FCM token' }, { status: 500 });
  }
}