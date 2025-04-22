
import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import GestionTesisPanel from "@/components/admin/GestionTesisPanel";
import { isStaffUser } from "@/lib/user-utils";

const GestionTesis = () => {
  const navigate = useNavigate();
  const { hasRole, isAuthenticated, user } = useAuth();
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  const userIsStaff = isStaffUser(user);

  React.useEffect(() => {
    // Permitir acceso a bibliotecario o administrador, o en modo desarrollo
    if (!userIsStaff && !isDev) {
      navigate("/");
    }
  }, [userIsStaff, navigate, isDev]);

  return (
    <MainLayout>
      {!isAuthenticated && !userIsStaff && !isDev ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Autenticación requerida</p>
          <p>Debes iniciar sesión como bibliotecario o administrador para gestionar las tesis.</p>
        </div>
      ) : (
        <GestionTesisPanel isAuthenticated={isAuthenticated || isDev} />
      )}
    </MainLayout>
  );
};

export default GestionTesis;
