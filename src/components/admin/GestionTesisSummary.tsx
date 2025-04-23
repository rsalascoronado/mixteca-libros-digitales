
import React from "react";

interface GestionTesisSummaryProps {
  count: number;
  isLoading: boolean;
}

const GestionTesisSummary: React.FC<GestionTesisSummaryProps> = ({ count, isLoading }) => (
  <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2">
    <p className="text-gray-600 text-sm sm:text-base">
      Mostrando {count} {count === 1 ? 'tesis' : 'tesis'}
      {isLoading && ' (Cargando...)'}
    </p>
  </div>
);

export default GestionTesisSummary;
