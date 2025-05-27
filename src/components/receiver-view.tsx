
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link2, Loader2, Download, FileText } from 'lucide-react';

export function ReceiverView() {
  const [shareCode, setShareCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [receivedFileUrl, setReceivedFileUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const ws = useRef<WebSocket | null>(null);
  // const pc = useRef<RTCPeerConnection | null>(null); // WebRTC peer connection
  // const receivedChunks = useRef<Blob[]>([]); // To store received file chunks

  const connectWebSocket = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      return Promise.resolve(ws.current);
    }

    return new Promise<WebSocket>((resolve, reject) => {
      ws.current = new WebSocket('ws://localhost:8080');

      ws.current.onopen = () => {
        console.log('Receiver WebSocket connected');
        resolve(ws.current!);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data as string);
        console.log('Receiver received message:', data);
        switch (data.type) {
          case 'room_joined':
            setIsConnected(true);
            setIsLoading(false);
            toast({ title: 'Connected to Room!', description: `Ready to receive from peer ${data.peerId}.` });
            // If sender sends file info upon connection, handle it here.
            // Otherwise, wait for offer or other signals.
            break;
          case 'offer':
            // TODO: Set remote description with the offer, create answer
            break;
          case 'candidate':
            // TODO: Add ICE candidate
            break;
          case 'file_info': // Custom message type for file details
            setFileInfo({ name: data.name, size: data.size });
            break;
          case 'peer_left':
            setIsConnected(false);
            setFileInfo(null);
            setReceivedFileUrl(null);
            toast({ title: 'Peer Disconnected', description: `Sender ${data.peerId} left.`, variant: 'destructive' });
            // TODO: Cleanup WebRTC connection
            break;
          case 'error':
            setIsLoading(false);
            toast({ title: 'Error', description: data.message, variant: 'destructive' });
            break;
        }
      };

      ws.current.onerror = (error) => {
        console.error('Receiver WebSocket error:', error);
        toast({ title: 'WebSocket Error', description: 'Could not connect to signaling server.', variant: 'destructive' });
        setIsLoading(false);
        reject(error);
      };

      ws.current.onclose = () => {
        console.log('Receiver WebSocket disconnected');
        setIsConnected(false);
        // Optionally handle reconnection logic or UI updates
      };
    });
  };


  const handleConnectToRoom = async () => {
    if (!shareCode.trim()) {
      toast({ title: 'No Share Code', description: 'Please enter the share code from the sender.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const socket = await connectWebSocket();
      socket.send(JSON.stringify({ type: 'join_room', shareCode: shareCode.toUpperCase() }));
    } catch (error) {
      // Error toast handled in connectWebSocket's onerror
      setIsLoading(false);
    }
  };

  // Placeholder for file download logic
  const handleDownloadFile = () => {
    if (receivedFileUrl && fileInfo) {
      const a = document.createElement('a');
      a.href = receivedFileUrl;
      a.download = fileInfo.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(receivedFileUrl); // Clean up
      setReceivedFileUrl(null); // Reset for next transfer
      toast({title: "Download Started", description: `Downloading ${fileInfo.name}`});
    }
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Receive a File</CardTitle>
        <CardDescription>Enter the share code provided by the sender to connect.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="share-code">Share Code</Label>
          <Input 
            id="share-code" 
            type="text" 
            value={shareCode} 
            onChange={(e) => setShareCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-digit code"
            className="text-lg font-mono tracking-widest"
            maxLength={6}
            disabled={isLoading || isConnected}
          />
        </div>

        <Button onClick={handleConnectToRoom} disabled={!shareCode || isLoading || isConnected} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
          Connect to Sender
        </Button>

        {isConnected && (
          <div className="p-4 border rounded-md bg-muted/50 space-y-3">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Connected to sender! Waiting for file...
            </p>
            {fileInfo && (
              <div className="text-sm">
                <p><strong>File Name:</strong> {fileInfo.name}</p>
                <p><strong>File Size:</strong> {(fileInfo.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
            {/* Placeholder for progress bar */}
            {/* <Progress value={33} className="w-full" /> */}
            {receivedFileUrl && fileInfo && (
               <Button onClick={handleDownloadFile} className="w-full mt-2">
                <Download className="mr-2 h-4 w-4" />
                Download {fileInfo.name}
              </Button>
            )}
          </div>
        )}
        {!isConnected && !isLoading && (
            <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
                <FileText className="mx-auto h-10 w-10 mb-2"/>
                <p>Enter a share code and connect to start receiving a file.</p>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
         The signaling server (ws://localhost:8080) must be running.
        </p>
      </CardFooter>
    </Card>
  );
}
