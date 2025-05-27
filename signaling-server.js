
const WebSocket = require('ws');
const crypto = require('crypto');

const wss = new WebSocket.Server({ port: 8080 });

// Store connections: Map<shareCode, { sender?: WebSocket, receiver?: WebSocket, senderId?: string, receiverId?: string }>
const rooms = new Map();
// Store clients and their IDs: Map<WebSocket, string>
const clients = new Map();

console.log('Signaling server started on ws://localhost:8080');

function generateUniqueId() {
  return crypto.randomBytes(8).toString('hex');
}

wss.on('connection', (ws) => {
  const clientId = generateUniqueId();
  clients.set(ws, clientId);
  console.log(`Client ${clientId} connected`);

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.error('Failed to parse message or message is not JSON:', message);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON message format.' }));
      return;
    }

    console.log(`Received message from ${clientId}:`, data);

    const room = rooms.get(data.shareCode);

    switch (data.type) {
      case 'create_room': {
        const shareCode = crypto.randomUUID().slice(0, 6).toUpperCase();
        rooms.set(shareCode, { sender: ws, senderId: clientId });
        ws.send(JSON.stringify({ type: 'room_created', shareCode, clientId }));
        console.log(`Room ${shareCode} created by sender ${clientId}`);
        break;
      }
      case 'join_room': {
        if (!data.shareCode) {
          ws.send(JSON.stringify({ type: 'error', message: 'Share code is required to join a room.' }));
          return;
        }
        const roomToJoin = rooms.get(data.shareCode);
        if (roomToJoin && !roomToJoin.receiver) {
          roomToJoin.receiver = ws;
          roomToJoin.receiverId = clientId;
          rooms.set(data.shareCode, roomToJoin);
          // Notify sender that receiver has joined
          roomToJoin.sender?.send(JSON.stringify({ type: 'peer_joined', peerId: clientId, shareCode: data.shareCode }));
          // Notify receiver they have joined
          ws.send(JSON.stringify({ type: 'room_joined', peerId: roomToJoin.senderId, clientId, shareCode: data.shareCode }));
          console.log(`Receiver ${clientId} joined room ${data.shareCode}. Sender: ${roomToJoin.senderId}`);
        } else if (roomToJoin && roomToJoin.receiver) {
          ws.send(JSON.stringify({ type: 'error', message: 'Room is full.' }));
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Room not found.' }));
        }
        break;
      }
      case 'offer':
      case 'answer':
      case 'candidate': {
        if (!room) {
          ws.send(JSON.stringify({ type: 'error', message: 'Room not found for signaling.' }));
          return;
        }
        // Determine the target peer
        const targetIsSender = room.receiverId === clientId;
        const targetWs = targetIsSender ? room.sender : room.receiver;
        
        if (targetWs && targetWs.readyState === WebSocket.OPEN) {
          targetWs.send(JSON.stringify({ ...data, peerId: clientId }));
          console.log(`Relayed ${data.type} from ${clientId} to ${clients.get(targetWs)} in room ${data.shareCode}`);
        } else {
          console.log(`Failed to relay ${data.type}: Target peer not found or connection closed in room ${data.shareCode}`);
          ws.send(JSON.stringify({ type: 'error', message: 'Peer not available to relay message.' }));
        }
        break;
      }
      default:
        console.log('Unknown message type:', data.type);
        ws.send(JSON.stringify({ type: 'error', message: `Unknown message type: ${data.type}` }));
    }
  });

  ws.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    clients.delete(ws);
    // Handle room cleanup if a client disconnects
    for (const [shareCode, room] of rooms.entries()) {
      let roomUpdated = false;
      if (room.sender === ws) {
        console.log(`Sender ${clientId} left room ${shareCode}. Notifying receiver.`);
        room.receiver?.send(JSON.stringify({ type: 'peer_left', peerId: clientId, shareCode }));
        room.sender = undefined;
        room.senderId = undefined;
        roomUpdated = true;
      } else if (room.receiver === ws) {
        console.log(`Receiver ${clientId} left room ${shareCode}. Notifying sender.`);
        room.sender?.send(JSON.stringify({ type: 'peer_left', peerId: clientId, shareCode }));
        room.receiver = undefined;
        room.receiverId = undefined;
        roomUpdated = true;
      }

      if (roomUpdated) {
        // If room is now empty, delete it
        if (!room.sender && !room.receiver) {
          rooms.delete(shareCode);
          console.log(`Room ${shareCode} is empty and has been deleted.`);
        } else {
          rooms.set(shareCode, room); // Update room if one peer is still there
        }
      }
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error);
  });
});
