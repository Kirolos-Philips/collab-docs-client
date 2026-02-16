import { useState, useEffect, useRef, useCallback } from 'react';
import * as Y from 'yjs';
import {
  Awareness,
  encodeAwarenessUpdate,
  applyAwarenessUpdate,
  removeAwarenessStates,
} from 'y-protocols/awareness.js';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Creates or retrieves Yjs instances stored in refs.
 * Survives React StrictMode double-mount because refs persist
 * across the cleanup → re-run cycle.
 */
function getOrCreateYjsInstances(ydocRef, awarenessRef) {
  // If the ydoc was destroyed (or never created), make fresh instances
  if (!ydocRef.current || ydocRef.current.isDestroyed) {
    ydocRef.current = new Y.Doc();
    // Always recreate awareness when doc changes
    awarenessRef.current = new Awareness(ydocRef.current);
  }
  // If awareness was destroyed but doc is alive, recreate awareness
  if (!awarenessRef.current) {
    awarenessRef.current = new Awareness(ydocRef.current);
  }
  return {
    ydoc: ydocRef.current,
    awareness: awarenessRef.current,
  };
}

/**
 * Send a "cursor removed" awareness update, then close the WebSocket.
 * This ensures remote clients immediately delete our cursor
 * instead of waiting for the 30-second awareness timeout.
 */
function sendRemovalAndCloseWS(awareness, wsRef) {
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    try {
      // 1. Mark local state as null (removed)
      awareness.setLocalState(null);
      // 2. Encode and send this removal update
      const clientID = awareness.clientID;
      const update = encodeAwarenessUpdate(awareness, [clientID]);
      const updateB64 = btoa(String.fromCharCode(...update));
      wsRef.current.send(JSON.stringify({ type: 'awareness', update: updateB64 }));
    } catch (e) {
      // Ignore — best-effort removal
    }
  }
  if (wsRef.current) {
    wsRef.current.close();
    wsRef.current = null;
  }
}

export const useCollaboration = (id) => {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState(new Map());
  const [isConnected, setIsConnected] = useState(false);

  // Refs that persist across StrictMode re-mounts
  const ydocRef = useRef(null);
  const awarenessRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectTimeout = useRef(null);
  const reconnectAttempts = useRef(0);

  // State so child components re-render when instances change
  const [yjsState, setYjsState] = useState(() => {
    const { ydoc, awareness } = getOrCreateYjsInstances(ydocRef, awarenessRef);
    return {
      ydoc,
      ytext: ydoc.getText('content'),
      awareness,
    };
  });

  // Main effect: WebSocket + listeners lifecycle
  useEffect(() => {
    const { ydoc, awareness } = getOrCreateYjsInstances(ydocRef, awarenessRef);
    const ytext = ydoc.getText('content');

    // Publish fresh refs to state so children get working instances
    setYjsState({ ydoc, ytext, awareness });

    // ── Awareness → activeUsers sync ──
    const updateActiveUsers = () => {
      const states = awareness.getStates();
      const usersMap = new Map();
      const now = Date.now();
      
      states.forEach((state, clientId) => {
        if (clientId === awareness.clientID) return;
        
        // Only include users with valid state and check for stale metadata
        const meta = awareness.meta.get(clientId);
        if (state.user && state.user.name && meta) {
          usersMap.set(clientId, {
            username: state.user.name,
            avatar_url: state.user.avatar_url,
            color: state.user.color || '#2563eb',
            cursor: state.cursor,
            lastSeen: meta.lastUpdated * 1000,
          });
        }
      });
      setActiveUsers(usersMap);
    };
    awareness.on('change', updateActiveUsers);

    // ── Set local user info ──
    if (user) {
      awareness.setLocalStateField('user', {
        name: user.username,
        avatar_url: user.avatar_url,
        color: user.color || `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      });
    }

    // ── WebSocket connection ──
    const connectWS = () => {
      // ... same as before ...
      if (
        wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING
      )
        return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
      const token = localStorage.getItem('access_token');
      const url = `${protocol}//${host}/documents/${id}/sync?token=${token}`;

      console.log('Connecting to WS:', url);
      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        if (socket !== wsRef.current) return;
        console.log('WebSocket Connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      socket.onmessage = (event) => {
        if (socket !== wsRef.current) return;
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'sync_state' || message.type === 'update') {
            const updateB64 = message.state || message.update;
            if (updateB64) {
              const binaryUpdate = Uint8Array.from(atob(updateB64), (c) => c.charCodeAt(0));
              Y.applyUpdate(ydoc, binaryUpdate, 'socket');
            }
          } else if (message.type === 'awareness') {
            const awarenessUpdate = message.update;
            if (awarenessUpdate) {
              const binaryUpdate = Uint8Array.from(atob(awarenessUpdate), (c) => c.charCodeAt(0));
              applyAwarenessUpdate(awareness, binaryUpdate, 'socket');
            }
          }
        } catch (error) {
          console.error('Failed to process WS message:', error);
        }
      };

      socket.onclose = () => {
        if (socket !== wsRef.current) return;
        wsRef.current = null;
        setIsConnected(false);
        if (reconnectAttempts.current < 5) {
          reconnectAttempts.current += 1;
          reconnectTimeout.current = setTimeout(connectWS, 2000 * reconnectAttempts.current);
        }
      };
    };

    // ── Listeners for outbound updates ──
    const handleYdocUpdate = (update, origin) => {
      if (origin !== 'socket' && wsRef.current?.readyState === WebSocket.OPEN) {
        const updateB64 = btoa(String.fromCharCode(...update));
        wsRef.current.send(JSON.stringify({ type: 'update', update: updateB64 }));
      }
    };

    const handleAwarenessUpdate = ({ added, updated, removed }, origin) => {
      if (origin !== 'socket' && wsRef.current?.readyState === WebSocket.OPEN) {
        const changedClients = added.concat(updated).concat(removed);
        const update = encodeAwarenessUpdate(awareness, changedClients);
        const updateB64 = btoa(String.fromCharCode(...update));
        wsRef.current.send(JSON.stringify({ type: 'awareness', update: updateB64 }));
      }
    };

    ydoc.on('update', handleYdocUpdate);
    awareness.on('update', handleAwarenessUpdate);

    connectWS();

    // ── Page Close/Refresh Handler ──
    const handleBeforeUnload = () => {
      // Special case: send removal synchronously using the helper
      sendRemovalAndCloseWS(awareness, wsRef);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // ── Cleanup ──
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);

      // Signal removal before closing
      removeAwarenessStates(awareness, [awareness.clientID], 'cleanup');

      ydoc.off('update', handleYdocUpdate);
      awareness.off('change', updateActiveUsers);
      awareness.off('update', handleAwarenessUpdate);

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [id, user]);

  // Separate effect: destroy Yjs instances only on true unmount
  useEffect(() => {
    return () => {
      // Send removal one more time in case the main effect already
      // removed the listeners (belt-and-suspenders)
      sendRemovalAndCloseWS(awarenessRef.current, wsRef);

      if (awarenessRef.current) {
        awarenessRef.current.destroy();
        awarenessRef.current = null;
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
        ydocRef.current = null;
      }
    };
  }, []);

  return {
    ydoc: yjsState.ydoc,
    ytext: yjsState.ytext,
    awareness: yjsState.awareness,
    activeUsers,
    isConnected,
  };
};
