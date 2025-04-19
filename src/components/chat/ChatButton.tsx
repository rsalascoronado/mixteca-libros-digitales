
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ChatWindow from './ChatWindow';

const ChatButton = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-in fade-in-50 slide-in-from-bottom-6"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="ml-2">Chat con bibliotecario</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[400px] sm:w-[540px] p-0 h-[600px]"
      >
        <div className="h-full">
          <ChatWindow />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatButton;
