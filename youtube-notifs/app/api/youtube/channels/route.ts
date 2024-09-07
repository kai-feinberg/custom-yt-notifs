import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const response = await youtube.search.list({
      part: ['snippet'],
      q: query,
      type: ['channel'],
      maxResults: 5,
    });

    const channels = response.data.items?.map(item => ({
      id: item.snippet?.channelId,
      title: item.snippet?.channelTitle,
      description: item.snippet?.description,
      thumbnail: item.snippet?.thumbnails?.default?.url,
    }));

    return NextResponse.json(channels);
  } catch (error) {
    console.error('YouTube API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch YouTube channels' }, { status: 500 });
  }
}