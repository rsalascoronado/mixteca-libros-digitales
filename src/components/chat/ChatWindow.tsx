
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const ChatWindow = () => {
  const [message, setMessage] = useState('');

  // Placeholder para futura integración con backend
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    console.log('Mensaje enviado:', message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary p-2 rounded-t-lg">
        <h2 className="text-base font-bold text-primary-foreground">
          Chat con Bibliotecario
        </h2>
        <p className="text-xs text-primary-foreground/80">
          Tiempo de respuesta aproximado: 5 minutos
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-background">
        <div className="bg-muted p-2 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Bienvenido al chat de la biblioteca. ¿En qué podemos ayudarte?
          </p>
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="p-2 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 h-8 text-sm"
          />
          <Button type="submit" size="sm" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
