import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
// Note: 'content' state removed — CodeMirror binds directly to ytext via yCollab
import * as Y from 'yjs';
import { useAuth } from '../../../contexts/AuthContext';

export const useCollaboration = (id) => {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState(new Map());
  const [isConnected, setIsConnected] = useState(false);

  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const reconnectAttempts = useRef(0);

  // Yjs Setup
  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText('content'), [ydoc]);

  const handleRemotePresence = useCallback((data) => {
    setActiveUsers((prev) => {
      const next = new Map(prev);
      next.set(data.user_id, {
        username: data.username,
        avatar_url: data.avatar_url,
        color: data.color || '#2563eb',
        lastSeen: Date.now(),
      });
      return next;
    });
  }, []);

  const connectWS = useCallback(() => {
    if (
      ws.current?.readyState === WebSocket.OPEN ||
      ws.current?.readyState === WebSocket.CONNECTING
    )
      return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
    const token = localStorage.getItem('access_token');
    const url = `${protocol}//${host}/documents/${id}/sync?token=${token}`;

    console.log('Connecting to WS:', url);
    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen = () => {
      if (socket !== ws.current) return;
      console.log('WebSocket Connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    socket.onmessage = (event) => {
      if (socket !== ws.current) return;
      try {
        const message = JSON.parse(event.data);

        if (message.type === 'sync_state' || message.type === 'update') {
          const updateB64 = message.state || message.update;
          if (updateB64) {
            const binaryUpdate = Uint8Array.from(atob(updateB64), (c) => c.charCodeAt(0));
            Y.applyUpdate(ydoc, binaryUpdate, 'socket');
          }
        } else if (message.type === 'presence') {
          handleRemotePresence(message);
        }
      } catch (error) {
        console.error('Failed to process WS message:', error);
      }
    };

    socket.onclose = (event) => {
      if (socket !== ws.current) return;
      console.log('WebSocket Disconnected', event.code, event.reason);
      ws.current = null;
      setIsConnected(false);

      // Reconnect logic
      if (reconnectAttempts.current < 5) {
        reconnectAttempts.current += 1;
        const delay = Math.min(10000, 2000 * reconnectAttempts.current);
        reconnectTimeout.current = setTimeout(connectWS, delay);
      }
    };

    socket.onerror = (error) => {
      if (socket !== ws.current) return;
      console.error('WebSocket Error:', error);
    };
  }, [id, ydoc, handleRemotePresence]);

  useEffect(() => {
    connectWS();

    // Yjs Update Observer (Outbound)
    const handleYdocUpdate = (update, origin) => {
      if (origin !== 'socket' && ws.current?.readyState === WebSocket.OPEN) {
        const updateB64 = btoa(String.fromCharCode(...update));
        ws.current.send(JSON.stringify({ type: 'update', update: updateB64 }));
      }
    };

    ydoc.on('update', handleYdocUpdate);

    // Heartbeat/Presence interval
    const presenceInterval = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN && user) {
        ws.current.send(
          JSON.stringify({
            type: 'presence',
            username: user.username,
            avatar_url: user.avatar_url,
            color: user.color, // Assuming user might have a color
          })
        );
      }
    }, 3000);

    // Stale users cleanup
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setActiveUsers((prev) => {
        const next = new Map(prev);
        let changed = false;
        for (const [userId, data] of next.entries()) {
          if (now - data.lastSeen > 10000) {
            next.delete(userId);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 5000);

    return () => {
      clearInterval(presenceInterval);
      clearInterval(cleanupInterval);
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ydoc.off('update', handleYdocUpdate);
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      ydoc.destroy();
    };
  }, [id, ydoc, ytext, connectWS, user]);

  return {
    ydoc,
    ytext,
    activeUsers,
    isConnected,
  };
};
