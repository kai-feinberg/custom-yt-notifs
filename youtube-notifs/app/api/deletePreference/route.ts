// /pages/api/deletePreference.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Firebase Admin SDK setup

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const preferenceId = searchParams.get('id');

  // Validate that a preferenceId is provided
  if (!preferenceId) {
    return NextResponse.json({ error: 'Preference ID is required' }, { status: 400 });
  }

  try {
    // Reference the specific document by ID and delete it
    const docRef = db.collection('preferences').doc(preferenceId);
    await docRef.delete(); // Delete the document

    return NextResponse.json({ message: 'Preference deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting preference:', error);
    return NextResponse.json({ error: 'Failed to delete preference' }, { status: 500 });
  }
}
