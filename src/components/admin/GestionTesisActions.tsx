
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataExport from "./DataExport";
import DataImport from "./DataImport";
import type { Thesis } from "@/types";

interface GestionTesisActionsProps {
  onImport: (data: any[]) => void;
  exportData: Thesis[];
  onAdd: () => void;
}

const GestionTesisActions: React.FC<GestionTesisActionsProps> = ({
  onImport,
  exportData,
  onAdd
}) => (
  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
    <DataImport onImport={onImport} accept=".csv,.json,.xlsx" />
    <DataExport
      data={exportData}
      filename="tesis-export"
      buttonLabel="Exportar tesis"
    />
    <Button onClick={onAdd} className="w-full sm:w-auto">
      <Plus className="h-4 w-4 mr-2" />
      Agregar tesis
    </Button>
  </div>
);

export default GestionTesisActions;
