import { io } from "socket.io-client";

const WS_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class RealtimeService {
  constructor() {
    this.socket = null;
    this.topicListeners = new Map();
  }

  connect(token) {
    if (!token) {
      return null;
    }

    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.connect();
      return this.socket;
    }

    this.socket = io(WS_BASE_URL, {
      transports: ["websocket"],
      autoConnect: true,
      auth: { token },
      query: { token },
    });

    this.socket.on("topic", (envelope) => {
      if (!envelope || typeof envelope.topic !== "string") {
        return;
      }

      const listeners = this.topicListeners.get(envelope.topic);
      if (!listeners || listeners.size === 0) {
        return;
      }

      for (const listener of listeners) {
        listener(envelope.data);
      }
    });

    return this.socket;
  }

  subscribe(topic, listener) {
    if (!this.topicListeners.has(topic)) {
      this.topicListeners.set(topic, new Set());
    }

    this.topicListeners.get(topic).add(listener);

    return () => {
      const listeners = this.topicListeners.get(topic);
      if (!listeners) {
        return;
      }

      listeners.delete(listener);
      if (listeners.size === 0) {
        this.topicListeners.delete(topic);
      }
    };
  }

  disconnect() {
    if (!this.socket) {
      return;
    }

    this.socket.disconnect();
    this.socket = null;
  }
}

const realtimeService = new RealtimeService();

export default realtimeService;
