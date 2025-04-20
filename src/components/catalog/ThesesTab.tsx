
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ThesisTable from "@/components/thesis/ThesisTable";
import ThesisSearch from "@/components/thesis/ThesisSearch";
import { mockTheses } from "@/types";
import { IThesis } from "@/types/interfaces";

const fetchTheses = async () => {
  try {
    // For now, mockTheses; update when the database table exists
    return mockTheses as IThesis[];
  } catch (error) {
    console.error("Error fetching theses:", error);
    return [];
  }
};

const ThesesTab: React.FC = () => {
  const [thesisSearchTerm, setThesisSearchTerm] = useState("");
  const [thesisTipoFiltro, setThesisTipoFiltro] = useState("");

  const {
    data: theses = [],
    isLoading: thesesLoading,
    error: thesesError,
  } = useQuery({
    queryKey: ["theses"],
    queryFn: fetchTheses,
  });

  const filteredTheses = useMemo(() => {
    return theses.filter((thesis) => {
      const matchesSearch =
        thesisSearchTerm.trim() === "" ||
        thesis.titulo.toLowerCase().includes(thesisSearchTerm.toLowerCase()) ||
        thesis.autor.toLowerCase().includes(thesisSearchTerm.toLowerCase()) ||
        thesis.director.toLowerCase().includes(thesisSearchTerm.toLowerCase());

      const matchesTipo =
        !thesisTipoFiltro ||
        thesisTipoFiltro === "all" ||
        thesis.tipo === thesisTipoFiltro;

      return matchesSearch && matchesTipo;
    });
  }, [theses, thesisSearchTerm, thesisTipoFiltro]);

  return (
    <div>
      <ThesisSearch
        busqueda={thesisSearchTerm}
        tipoFiltro={thesisTipoFiltro}
        onBusquedaChange={setThesisSearchTerm}
        onTipoFiltroChange={setThesisTipoFiltro}
        onLimpiarFiltros={() => {
          setThesisSearchTerm("");
          setThesisTipoFiltro("");
        }}
      />
      <div className="mb-4">
        <p className="text-gray-600 text-sm sm:text-base">
          Mostrando {filteredTheses.length} tesis
        </p>
      </div>
      {thesesLoading ? (
        <div className="p-4 text-center text-muted-foreground">
          Cargando tesis...
        </div>
      ) : thesesError ? (
        <div className="p-4 text-red-500 text-sm">
          Error obteniendo tesis: {(thesesError as Error).message}
        </div>
      ) : (
        <ThesisTable theses={filteredTheses} onEdit={() => {}} />
      )}
    </div>
  );
};

export default ThesesTab;
