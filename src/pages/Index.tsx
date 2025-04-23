
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockBooks } from '@/types';
import ChatButton from '@/components/chat/ChatButton';
import { useToast } from '@/hooks/use-toast';
import HeroSection from '@/components/index/HeroSection';
import RecentAdditionsSection from '@/components/index/RecentAdditionsSection';
import FeaturesSection from '@/components/index/FeaturesSection';
import FeaturedBooksSection from '@/components/index/FeaturedBooksSection';
import CtaHelpSection from '@/components/index/CtaHelpSection';

const Index = () => {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();

  // Seleccionamos algunos libros destacados para mostrar
  const librosDestacados = mockBooks.slice(0, 3);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Consulta Biblioteca UTM');
    const body = encodeURIComponent('Hola, quisiera realizar una consulta sobre...');
    const mailtoLink = `mailto:biblioteca@mixteco.utm.mx?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    toast({
      title: "Contacto iniciado",
      description: "Se está abriendo tu cliente de correo electrónico para contactar a la biblioteca.",
    });
    if (hasRole('bibliotecario')) {
      toast({
        title: "Notificación de correo",
        description: "Se ha iniciado una nueva consulta a través del sistema de biblioteca.",
      });
    }
  };

  return (
    <MainLayout>
      <HeroSection user={user} hasRole={hasRole} />
      <RecentAdditionsSection />
      <FeaturesSection user={user} hasRole={hasRole} />
      <FeaturedBooksSection librosDestacados={librosDestacados} />
      <CtaHelpSection onContactClick={handleContactClick} />
      <ChatButton />
    </MainLayout>
  );
};

export default Index;
