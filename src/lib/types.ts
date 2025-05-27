
// This file can be used for WebRTC related type definitions later.
// For now, it's cleared of old types.

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'candidate' | 'create_room' | 'join_room' | 'room_created' | 'room_joined' | 'peer_joined' | 'peer_left' | 'file_info' | 'error';
  shareCode?: string;
  peerId?: string; // ID of the peer sending the message or target peer
  clientId?: string; // Own client ID assigned by server
  candidate?: RTCIceCandidateInit | RTCIceCandidate;
  sdp?: RTCSessionDescriptionInit | string; // string for older browsers if needed
  message?: string; // For error messages
  name?: string; // For file_info
  size?: number; // For file_info
}

// Add any other WebRTC specific types here as needed
