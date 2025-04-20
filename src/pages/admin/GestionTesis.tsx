
import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import GestionTesisPanel from "@/components/admin/GestionTesisPanel";

const GestionTesis = () => {
  const navigate = useNavigate();
  const { hasRole, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!hasRole(["bibliotecario", "administrador"])) {
      navigate("/");
      return;
    }
  }, [hasRole, navigate]);

  return (
    <MainLayout>
      {!isAuthenticated ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Autenticación requerida</p>
          <p>Debes iniciar sesión para gestionar las tesis.</p>
        </div>
      ) : (
        <GestionTesisPanel isAuthenticated={isAuthenticated} />
      )}
    </MainLayout>
  );
};

export default GestionTesis;
