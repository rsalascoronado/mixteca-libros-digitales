
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Users } from 'lucide-react';
import { User, UserRole } from '@/types';

interface HeroSectionProps {
  user: User | null;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}
const HeroSection = ({ user, hasRole }: HeroSectionProps) => (
  <section className="bg-primary py-16 text-primary-foreground">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">Sistema de Gestión Bibliotecaria</h1>
          <p className="text-xl mb-6">
            Bienvenido al sistema de gestión de libros de la Biblioteca de la Universidad Tecnológica de la Mixteca.
          </p>
          {user ? (
            <div className="flex flex-wrap gap-4">
              <Link to="/catalogo">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar libros
                </Button>
              </Link>
              <Link to="/mis-prestamos">
                <Button size="lg" variant="outline" className="border-white hover:bg-primary-foreground/10 text-blue-950">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Mis préstamos
                </Button>
              </Link>
              {hasRole('administrador') && (
                <Link to="/admin/usuarios">
                  <Button size="lg" variant="outline" className="border-white hover:bg-primary-foreground/10 text-blue-950">
                    <Users className="mr-2 h-5 w-5" />
                    Gestionar usuarios
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/catalogo">
                <Button size="lg" variant="outline" className="border-white hover:bg-primary-foreground/10 text-blue-950">
                  <Search className="mr-2 h-5 w-5" />
                  Explorar catálogo
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img alt="Biblioteca UTM" className="rounded-lg shadow-lg max-h-96 object-cover" src="/lovable-uploads/f46b4744-0ea0-4e43-9ce3-2a800df2cc80.png" />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
