// /pages/api/youtube.js

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const query = searchParams.get('q');
    const channelId = searchParams.get('channelId');  // Accept channelId from the query parameters

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    try {
      // Construct the search parameters with the optional channelId filter
      const searchParams = {
        part: ['snippet'],
        q: query,
        type: ['video'],
        maxResults: 10,
        ...(channelId && { channelId }) // Add channelId if provided
      };

      const response = await youtube.search.list(searchParams);

      const videos = response.data.items?.map(item => ({
        id: item.id?.videoId,
        title: item.snippet?.title,
        description: item.snippet?.description,
        thumbnail: item.snippet?.thumbnails?.default?.url,
      }));

      return res.status(200).json(videos);
    } catch (error) {
      console.error('YouTube API Error:', error);
      return res.status(500).json({ error: 'Failed to fetch YouTube results' });
    }
  } else {
    // Return 405 for methods other than GET
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
