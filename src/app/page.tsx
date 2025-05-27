
'use client';

import { Header } from '@/components/header'; // Keep header for theme toggle etc.
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SenderView } from '@/components/sender-view';
import { ReceiverView } from '@/components/receiver-view';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header /> 
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center justify-start pt-12">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center bg-muted/30">
            <CardTitle className="text-3xl font-bold text-foreground">
              LAN File Transfer
            </CardTitle>
            <CardDescription>
              Share files directly with others on the same network using WebRTC.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="send" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="send">Send File</TabsTrigger>
                <TabsTrigger value="receive">Receive File</TabsTrigger>
              </TabsList>
              <TabsContent value="send">
                <SenderView />
              </TabsContent>
              <TabsContent value="receive">
                <ReceiverView />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} LAN File Transfer. Peer-to-peer.
      </footer>
    </div>
  );
}
