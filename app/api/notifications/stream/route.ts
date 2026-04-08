import { NextRequest } from 'next/server';
import { authGuard } from '@/lib/auth/guards';
import connectDB from '@/lib/db/connect';
import Notification from '@/lib/db/models/Notification';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { authorized, user } = await authGuard(request);

  if (!authorized || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();
  const userId = user.id;

  const stream = new ReadableStream({
    async start(controller) {
      await connectDB();

      // Helper to send data
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Initial check
      let lastChecked = new Date();
      const initialUnread = await Notification.countDocuments({ userId, read: false });
      sendEvent({ type: 'INIT', unreadCount: initialUnread });

      // Polling loop inside the stream (Server-side polling is more efficient than client-side)
      const interval = setInterval(async () => {
        try {
          const newNotifications = await Notification.find({
            userId,
            read: false,
            createdAt: { $gt: lastChecked },
          }).sort({ createdAt: -1 });

          if (newNotifications.length > 0) {
            lastChecked = new Date();
            const unreadCount = await Notification.countDocuments({ userId, read: false });
            sendEvent({ 
              type: 'NEW_NOTIFICATIONS', 
              notifications: newNotifications,
              unreadCount 
            });
          }
        } catch (error) {
          console.error('SSE Stream error:', error);
        }
      }, 2000); // Check every 2 seconds on server

      // Close interval on stream close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
