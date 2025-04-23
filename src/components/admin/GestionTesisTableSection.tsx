
import React from "react";
import ThesisTable from "@/components/thesis/ThesisTable";
import type { Thesis } from "@/types";

interface GestionTesisTableSectionProps {
  theses: Thesis[];
  onEdit: (thesis: Thesis) => void;
  onDelete: (thesis: Thesis) => void;
}

const GestionTesisTableSection: React.FC<GestionTesisTableSectionProps> = ({
  theses,
  onEdit,
  onDelete
}) => (
  <div className="overflow-x-auto">
    <ThesisTable
      theses={theses}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  </div>
);

export default GestionTesisTableSection;
