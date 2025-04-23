
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface CtaHelpSectionProps {
  onContactClick: (e: React.MouseEvent) => void;
}
const CtaHelpSection = ({ onContactClick }: CtaHelpSectionProps) => (
  <section className="py-16 bg-[#56070c] text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4 text-white">¿Necesitas ayuda?</h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
        Si necesitas asistencia para encontrar un libro o realizar un préstamo, nuestro personal bibliotecario está disponible para ayudarte.
      </p>
      <Button
        size="lg"
        className="bg-white text-[#56070c] hover:bg-gray-100"
        onClick={onContactClick}
        asChild
      >
        <a href="#">
          <Mail className="mr-2 h-5 w-5" />
          Contactar a la biblioteca
        </a>
      </Button>
    </div>
  </section>
);

export default CtaHelpSection;
