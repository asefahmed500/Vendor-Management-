import { create } from 'zustand';
import { INotification } from '@/lib/db/models/Notification';

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  isConnected: boolean;
  setNotifications: (notifications: INotification[]) => void;
  addNotifications: (notifications: INotification[]) => void;
  setUnreadCount: (count: number) => void;
  setIsConnected: (connected: boolean) => void;
  markAsRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  setNotifications: (notifications) => set({ notifications }),
  addNotifications: (newNotifications) => 
    set((state) => ({ 
      notifications: [...newNotifications, ...state.notifications].slice(0, 50) 
    })),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  setIsConnected: (isConnected) => set({ isConnected }),
  markAsRead: (id) => 
    set((state) => ({
      notifications: state.notifications.map((n) => 
        n._id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
}));
