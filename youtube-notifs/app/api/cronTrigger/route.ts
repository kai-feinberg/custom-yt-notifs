import { db } from '@/lib/firebaseAdmin';  // Firebase admin setup

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'; // Fallback for local development

// Define the GET method for Next.js API route
export async function GET(req: Request) {
  try {
    // Fetch user preferences from Firebase
    const preferencesSnapshot = await db.collection('preferences').get();
    let notificationsSent = 0;
    let newVideos = 0;
    let latestVideos = []; // Initialize an array to store the latest videos
    const preferences = preferencesSnapshot.docs.map(doc => ({
      id: doc.id,
      userId: doc.data().userId,
      channelId: doc.data().channelId,
      searchQuery: doc.data().searchQuery,
      channelName: doc.data().channelName,
    }));

    for (const preference of preferences) {
      const { userId, channelId, searchQuery } = preference;

      // Get the latest video for the channel
      const latestVideo = await getTodaysVideo(channelId, searchQuery);

      if (latestVideo) {
        newVideos++;
        latestVideos.push(latestVideo); // Add the latest video to the list
        // Fetch the user's FCM token
        const userDoc = await db.collection('users').doc(userId).get();
        const fcmToken = userDoc.data()?.fcmToken;

          if (fcmToken) {
            // If new video found, send notification to the user
            await sendNotification(
              fcmToken,
              `New video`,
              `New video: ${latestVideo.title}`
            );
            console.log(`Notification sent for ${userId}`);
            notificationsSent++; // Increment counter for each notification sent
          }
      }
    }

    return new Response(JSON.stringify({ 
      message: `${newVideos} new videos found. Total notifications sent: ${notificationsSent}`,
      latestVideos: latestVideos // Include the list of latest videos in the response
    }), { status: 200 });
  } catch (error) {
    console.error('Error triggering notifications:', error);
    return new Response(JSON.stringify({ error: 'Error triggering notifications' }), { status: 500 });
  }
}

// Function to get the latest video from a YouTube channel
async function getTodaysVideo(channelId: string, query: string) {
  const response = await fetch(`${baseUrl}/api/youtube?channelId=${encodeURIComponent(channelId)}&query=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
 
  const data = await response.json();
  if (data && data.length > 0) {
    const { id, title, description, thumbnail } = data[0];
    return {
      videoId: id,
      title: title,
      description: description,
      thumbnail: thumbnail,
    };
  }

  return null;
}

// Function to send notification by calling the sendNotification API route
async function sendNotification(token: string, title: string, body: string) {
  
  // Send a test notification
  const notificationResponse = await fetch(`${baseUrl}/api/sendNotification`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        token: token,
        title: title,
        body: body,
    }),
});
  

if (!notificationResponse.ok) {
  throw new Error('Failed to send test notification');
}

  return notificationResponse.json();
}
