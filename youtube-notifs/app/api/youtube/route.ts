// /pages/api/youtube.js

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');
  const channelId = searchParams.get('channelId');  // Accept channelId from the query parameters

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    // Construct the search parameters with the optional channelId filter
    const searchParams = {
      part: ['snippet'],
      q: query,
      type: ['video'],
      maxResults: 3,
      channelId: channelId ,  // Add channelId if provided
      publishedAfter: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(), // Search for videos published in the last 24 hours
      // ...(channelId && { channelId }) // Add channelId if provided
    };

    const response = await youtube.search.list(searchParams);

    const videos = response.data.items?.map(item => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      description: item.snippet?.description,
      thumbnail: item.snippet?.thumbnails?.default?.url,
    }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error('YouTube API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch YouTube results' }, { status: 500 });
  }
}
