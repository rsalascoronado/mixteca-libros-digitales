
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import ChatWindow from './ChatWindow';

const ChatButton = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 rounded-full shadow-lg"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="ml-2">Chat con bibliotecario</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[calc(100vh/8)] max-h-[400px]">
        <div className="p-2 h-full">
          <ChatWindow />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ChatButton;
