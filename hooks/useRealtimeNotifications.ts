import { useEffect, useRef } from 'react';
import { useNotificationStore } from '@/lib/stores/useNotificationStore';
import { toast } from 'sonner';

export function useRealtimeNotifications(userId: string | undefined) {
  const { 
    addNotifications, 
    setUnreadCount, 
    setIsConnected,
    setNotifications
  } = useNotificationStore();
  
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial list
    const fetchInitial = async () => {
      try {
        const res = await fetch('/api/notifications?pageSize=10');
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data.notifications);
          setUnreadCount(data.data.unreadCount);
        }
      } catch (err) {
        console.error('Failed to fetch initial notifications:', err);
      }
    };

    fetchInitial();

    // Setup SSE
    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const es = new EventSource('/api/notifications/stream');
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
        console.log('SSE Connected');
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'INIT') {
            setUnreadCount(data.unreadCount);
          } else if (data.type === 'NEW_NOTIFICATIONS') {
            addNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
            
            // Show toast for the newest notification
            if (data.notifications.length > 0) {
              const latest = data.notifications[0];
              toast.info(latest.title, {
                description: latest.message,
              });
            }
          }
        } catch (err) {
          console.error('Error parsing SSE message:', err);
        }
      };

      es.onerror = (err) => {
        setIsConnected(false);
        console.error('SSE Error:', err);
        es.close();
        
        // Reconnect after 5 seconds
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [userId, addNotifications, setUnreadCount, setIsConnected, setNotifications]);
}
