
import React from 'react';
import { Search, BookOpen, Clock, FileDown, Users, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, UserRole } from '@/types';

interface FeaturesSectionProps {
  user: User | null;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const FeaturesSection = ({ user, hasRole }: FeaturesSectionProps) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Servicios de la Biblioteca</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Búsqueda de Libros</h3>
          <p className="text-gray-600 mb-4">
            Accede a nuestro amplio catálogo de libros académicos y encuentra el material que necesitas para tus estudios o investigaciones.
          </p>
          <Link to="/catalogo" className="mt-auto">
            <Button variant="outline" className="w-full">Explorar catálogo</Button>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Préstamos</h3>
          <p className="text-gray-600 mb-4">
            Solicita préstamos de libros según tu rol dentro de la universidad, con diferentes períodos de tiempo disponibles.
          </p>
          <Link to={user ? "/mis-prestamos" : "/login"} className="mt-auto">
            <Button variant="outline" className="w-full">
              {user ? "Mis préstamos" : "Iniciar sesión"}
            </Button>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Horarios</h3>
          <p className="text-gray-600 mb-4">
            Consulta los horarios de atención de la biblioteca y planifica tu visita.
          </p>
          <div className="mt-auto">
            <div className="text-sm text-gray-700 font-medium">
              Lunes a Viernes: 8:00 - 20:00 hrs<br />
              Sábados: 9:00 - 14:00 hrs
            </div>
          </div>
        </div>
      </div>
      {hasRole('administrador') && (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center mt-8">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <FileDown className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Exportación de Datos</h3>
          <p className="text-gray-600 mb-4">
            Como administrador, puedes exportar datos de libros y usuarios en varios formatos: CSV, JSON y Excel.
          </p>
          <div className="mt-auto flex gap-2">
            <Link to="/admin/libros">
              <Button variant="outline" size="sm">Libros</Button>
            </Link>
            <Link to="/admin/usuarios">
              <Button variant="outline" size="sm">Usuarios</Button>
            </Link>
          </div>
        </div>
      )}
      {hasRole('bibliotecario') && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Folder className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Gestión de Recursos</h3>
          <p className="text-gray-600 mb-4">
            Administra libros, libros digitales y tesis del sistema bibliotecario.
          </p>
          <div className="mt-auto flex gap-2">
            <Link to="/admin/libros">
              <Button variant="outline" size="sm">Libros</Button>
            </Link>
            <Link to="/admin/ebooks">
              <Button variant="outline" size="sm">Libros Digitales</Button>
            </Link>
            <Link to="/admin/tesis">
              <Button variant="outline" size="sm">Tesis</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  </section>
);

export default FeaturesSection;
