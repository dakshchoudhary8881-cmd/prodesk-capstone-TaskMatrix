class SocketService {
  private socket: any = null;
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
    };
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
