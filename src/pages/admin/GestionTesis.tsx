
import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import GestionTesisPanel from "@/components/admin/GestionTesisPanel";
import { isStaffUser } from "@/lib/user-utils";

const GestionTesis = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  const userIsStaff = isStaffUser(user);
  const canAccess = userIsStaff || isDev;

  React.useEffect(() => {
    if (!canAccess) {
      navigate("/");
    }
  }, [userIsStaff, navigate, isDev, canAccess]);

  return (
    <MainLayout>
      {!canAccess ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Acceso restringido</p>
          <p>Solo bibliotecarios y administradores pueden gestionar las tesis.</p>
        </div>
      ) : (
        <GestionTesisPanel isAuthenticated={isAuthenticated || isDev} />
      )}
    </MainLayout>
  );
};

export default GestionTesis;
