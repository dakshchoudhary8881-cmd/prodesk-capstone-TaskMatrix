import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import toast from 'react-hot-toast';

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;

  connect() {
    if (this.socket || this.isConnecting) return;
    this.isConnecting = true;

    // NO BACKEND: Mock the socket to avoid connection errors and logout loops
    console.log('Socket.io mocked (no backend)');
    this.isConnecting = false;
    
    // Create a dummy socket object to prevent null pointer errors
    this.socket = {
      on: () => {},
      off: () => {},
      emit: () => {},
      disconnect: () => {},
    } as any;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnecting = false;
      console.log('Socket.io connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Socket.io disconnected: ${reason}`);
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket.io connection error:', err.message);
      this.isConnecting = false;
      
      if (err.message === 'Authentication error') {
        this.socket?.disconnect();
        useAuthStore.getState().logout();
        toast.error('Session expired. Please log in again.');
      }
    });

    // Listen to real-time notifications
    this.socket.on('notification', (payload: any) => {
      // Normalize 'isRead' to 'read' if backend uses 'isRead'
      const normalizedPayload = {
        ...payload,
        read: payload.isRead ?? payload.read ?? false,
      };
      
      useNotificationStore.getState().receiveNotification(normalizedPayload);
      
      // Optionally show a toast for new notifications
      toast(normalizedPayload.title || 'New Notification', {
        icon: '🔔',
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }
}

export const socketService = new SocketService();
