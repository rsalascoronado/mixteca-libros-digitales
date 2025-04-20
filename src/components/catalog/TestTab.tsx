
import React from "react";
import BookSearchResultTest from "@/components/books/BookSearchResultTest";
import { Microscope } from "lucide-react";

const TestTab: React.FC = () => (
  <div>
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4 flex items-center gap-3">
      <Microscope className="text-yellow-800 w-5 h-5" />
      <p className="text-sm text-yellow-800">
        Modo de prueba: Este componente es solo para probar visualmente que la búsqueda de libros
        funcione correctamente. Puedes buscar por título, autor, ISBN o editorial.
      </p>
    </div>
    <BookSearchResultTest />
  </div>
);

export default TestTab;
