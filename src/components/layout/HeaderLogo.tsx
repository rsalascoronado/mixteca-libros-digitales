
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const HeaderLogo = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center space-x-2">
      {/* Logo UTM al lado izquierdo */}
      <img
        src="/lovable-uploads/c174f1e2-36e9-4062-8c41-e975c9886d5c.png"
        alt="Logo UTM"
        className="h-12 w-auto mr-2 hidden md:block bg-transparent"
        style={{
          filter: "drop-shadow(0 0 2px #fff)",
          maxHeight: "52px",
        }}
        draggable={false}
      />

      <Link to="/" className="flex items-center">
        <Button 
          variant="ghost" 
          size={isMobile ? "icon" : "default"} 
          className="text-primary-foreground hover:bg-[#56070c]/20 hover:text-white flex items-center"
        >
          <Home className="h-5 w-5 mr-2" />
          {!isMobile && "Inicio"}
          <span className="sr-only">Inicio</span>
        </Button>
      </Link>

      <Link to="/" className="flex items-center">
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight">Biblioteca</span>
          <span className="text-xs tracking-tight">Universidad Tecnológica de la Mixteca</span>
        </div>
      </Link>
    </div>
  );
};
