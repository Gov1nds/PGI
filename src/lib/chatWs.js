const WS_BASE =
  import.meta.env.VITE_WS_BASE_URL ||
  (import.meta.env.VITE_API_BASE_URL || "").replace(/^http/, "ws");

export class ChatWS {
  constructor(threadId, token) {
    this.url = `${WS_BASE}/api/v1/chat/ws/${threadId}?token=${encodeURIComponent(token)}`;
    this.handlers = [];
    this.backoff = 1000;
    this._closed = false;
    this.connect();
  }

  connect() {
    if (this._closed) return;
    try {
      this.ws = new WebSocket(this.url);
    } catch {
      this._scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.backoff = 1000;
      this.handlers.forEach((h) => {
        if (h.__onConnect) h.__onConnect();
      });
    };

    this.ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        this.handlers.forEach((h) => h(data));
      } catch {}
    };

    this.ws.onerror = () => {};

    this.ws.onclose = () => {
      if (!this._closed) this._scheduleReconnect();
    };
  }

  _scheduleReconnect() {
    setTimeout(() => {
      this.backoff = Math.min(this.backoff * 2, 30000);
      this.connect();
    }, this.backoff);
  }

  on(handler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  send(obj) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(obj));
    }
  }

  close() {
    this._closed = true;
    this.handlers = [];
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  get connected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
