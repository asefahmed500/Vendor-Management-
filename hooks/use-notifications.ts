'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { INotification } from '@/lib/db/models/Notification';

interface UseNotificationsReturn {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  isConnected: boolean;
}

export function useNotifications(pollInterval = 30000): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const result = await response.json();
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead' }),
      });
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      });
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, [fetchNotifications]);

  // Set up SSE connection for real-time updates
  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = () => setIsConnected(false);

    eventSource.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'unread_count') {
        setUnreadCount(data.count);
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  // Initial fetch and polling fallback
  useEffect(() => {
    fetchNotifications();
    if (!isConnected) {
      const interval = setInterval(fetchNotifications, pollInterval);
      return () => clearInterval(interval);
    }
  }, [fetchNotifications, isConnected, pollInterval]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead,
    isConnected,
  };
}
