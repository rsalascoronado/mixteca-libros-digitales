
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-4/12 px-4 mb-8 md:mb-0">
            <h4 className="text-lg font-semibold mb-4 text-white">Universidad Tecnológica de la Mixteca</h4>
            <p className="text-sm mb-4 text-white/90">
              Avenida Doctor Modesto Seara Vázquez, No 1<br />
              Huajuapan de León, Oaxaca, México<br />
              C.P. 69004
            </p>
            <p className="text-sm text-white/90">
              Tel. (953) 532 0399 | (953) 532 0214<br />
              Fax. (953) 532 0276
            </p>
          </div>
          
          <div className="w-full md:w-4/12 px-4 mb-8 md:mb-0">
            <h4 className="text-lg font-semibold mb-4 text-white">Enlaces rápidos</h4>
            <ul className="text-sm">
              {/* Mantener los mismos enlaces, solo ajustar el color */}
              <li className="mb-2">
                <Link to="/" className="text-white/90 hover:text-white transition-colors">Inicio</Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogo" className="text-white/90 hover:text-white transition-colors">Catálogo de libros</Link>
              </li>
              <li className="mb-2">
                <Link to="/mis-prestamos" className="text-white/90 hover:text-white transition-colors">Mis préstamos</Link>
              </li>
              <li className="mb-2">
                <a href="https://www.utm.mx" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">
                  Sitio web UTM
                </a>
              </li>
              <li className="mb-2">
                <a href="https://www.utm.mx/~biblioteca/" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">
                  Biblioteca UTM
                </a>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-4/12 px-4">
            <h4 className="text-lg font-semibold mb-4 text-white">Horario de atención</h4>
            <p className="text-sm mb-4 text-white">
              Lunes a Viernes<br />
              8:00 a 20:00 h
            </p>
            <p className="text-sm text-white">
              Sábados<br />
              9:00 a 14:00 h
            </p>
          </div>
        </div>
        
        <div className="w-full mt-8 pt-8 border-t border-gray-600 text-center">
          <p className="text-sm text-white/90">
            © {new Date().getFullYear()} Biblioteca Universidad Tecnológica de la Mixteca. Todos los derechos reservados.
          </p>
          <p className="text-sm mt-2 text-white/90">
            Elaborado por Raúl Salas Coronado.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
