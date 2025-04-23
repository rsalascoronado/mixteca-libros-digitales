
import React from "react";
import ThesisSearch from "@/components/thesis/ThesisSearch";

interface GestionTesisFiltersProps {
  busqueda: string;
  tipoFiltro: string;
  onBusquedaChange: (q: string) => void;
  onTipoFiltroChange: (t: string) => void;
  onLimpiarFiltros: () => void;
}

const GestionTesisFilters: React.FC<GestionTesisFiltersProps> = ({
  busqueda,
  tipoFiltro,
  onBusquedaChange,
  onTipoFiltroChange,
  onLimpiarFiltros
}) => (
  <ThesisSearch
    busqueda={busqueda}
    tipoFiltro={tipoFiltro}
    onBusquedaChange={onBusquedaChange}
    onTipoFiltroChange={onTipoFiltroChange}
    onLimpiarFiltros={onLimpiarFiltros}
  />
);

export default GestionTesisFilters;
