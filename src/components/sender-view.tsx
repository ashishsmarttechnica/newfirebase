
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, Loader2, UploadCloud, FileText } from 'lucide-react';

export function SenderView() {
  const [file, setFile] = useState<File | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [peerId, setPeerId] = useState<string | null>(null);
  const { toast } = useToast();
  const ws = useRef<WebSocket | null>(null);
  // const pc = useRef<RTCPeerConnection | null>(null); // WebRTC peer connection
  // const dataChannel = useRef<RTCDataChannel | null>(null); // WebRTC data channel

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setShareCode(null); // Reset share code if file changes
      setPeerId(null);
    }
  };

  const connectWebSocket = () => {
    // Ensure WebSocket is connected only once or reconnect if necessary
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      return Promise.resolve(ws.current);
    }
    
    return new Promise<WebSocket>((resolve, reject) => {
      ws.current = new WebSocket('ws://localhost:8080');

      ws.current.onopen = () => {
        console.log('Sender WebSocket connected');
        resolve(ws.current!);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data as string);
        console.log('Sender received message:', data);
        switch (data.type) {
          case 'room_created':
            setShareCode(data.shareCode);
            setIsLoading(false);
            toast({ title: 'Room Created!', description: `Share this code: ${data.shareCode}` });
            break;
          case 'peer_joined':
            setPeerId(data.peerId);
            toast({ title: 'Peer Connected!', description: `Receiver ${data.peerId} joined.` });
            // TODO: Initiate WebRTC connection sequence (create offer)
            break;
          case 'answer':
            // TODO: Set remote description with the answer
            break;
          case 'candidate':
            // TODO: Add ICE candidate
            break;
          case 'peer_left':
            setPeerId(null);
            toast({ title: 'Peer Disconnected', description: `Receiver ${data.peerId} left.`, variant: 'destructive' });
            // TODO: Cleanup WebRTC connection
            break;
          case 'error':
            setIsLoading(false);
            toast({ title: 'Error', description: data.message, variant: 'destructive' });
            break;
        }
      };

      ws.current.onerror = (error) => {
        console.error('Sender WebSocket error:', error);
        toast({ title: 'WebSocket Error', description: 'Could not connect to signaling server.', variant: 'destructive' });
        setIsLoading(false);
        reject(error);
      };

      ws.current.onclose = () => {
        console.log('Sender WebSocket disconnected');
        // Optionally handle reconnection logic or UI updates
      };
    });
  };

  const handleCreateRoom = async () => {
    if (!file) {
      toast({ title: 'No File Selected', description: 'Please select a file to share.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const socket = await connectWebSocket();
      socket.send(JSON.stringify({ type: 'create_room' }));
    } catch (error) {
      // Error toast handled in connectWebSocket's onerror
      setIsLoading(false);
    }
  };

  const copyShareCode = () => {
    if (shareCode) {
      navigator.clipboard.writeText(shareCode);
      toast({ title: 'Copied!', description: 'Share code copied to clipboard.' });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Send a File</CardTitle>
        <CardDescription>Select a file and generate a share code for the receiver.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Choose File</Label>
          <div className="flex items-center space-x-2">
            <Input id="file-upload" type="file" onChange={handleFileChange} className="flex-grow"/>
            {file && <FileText className="h-6 w-6 text-muted-foreground" />}
          </div>
          {file && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <Button onClick={handleCreateRoom} disabled={!file || isLoading || !!shareCode} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
          {shareCode ? 'Room Created - Waiting for Peer' : 'Generate Share Code'}
        </Button>

        {shareCode && (
          <div className="p-4 border rounded-md bg-muted/50 space-y-3">
            <p className="text-sm font-medium">Share this code with the receiver:</p>
            <div className="flex items-center space-x-2">
              <Input type="text" value={shareCode} readOnly className="text-lg font-mono tracking-widest flex-grow bg-background" />
              <Button variant="outline" size="icon" onClick={copyShareCode} aria-label="Copy share code">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {peerId ? (
              <p className="text-sm text-green-600 dark:text-green-400">Receiver ({peerId}) connected. Ready to transfer.</p>
            ) : (
              <p className="text-sm text-amber-600 dark:text-amber-400">Waiting for receiver to join...</p>
            )}
          </div>
        )}
         {/* Placeholder for QR Code */}
        {/* {shareCode && <div className="mt-4 p-2 border rounded-md flex justify-center"><p className="text-sm">QR Code will appear here</p></div>} */}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Ensure both devices are on the same Wi-Fi/LAN. The signaling server must be running.
        </p>
      </CardFooter>
    </Card>
  );
}
