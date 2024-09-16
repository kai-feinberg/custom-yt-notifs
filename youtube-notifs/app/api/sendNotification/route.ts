import { NextResponse } from 'next/server';
import { getMessaging } from 'firebase-admin/messaging';

export async function POST(request: Request) {
  const { token, title, body } = await request.json();

  if (!token || !title || !body) {
    return NextResponse.json({ error: 'Token, title, and body are required' }, { status: 400 });
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    const response = await getMessaging().send(message);
    return NextResponse.json({ message: 'Notification sent successfully', response }, { status: 200 });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}