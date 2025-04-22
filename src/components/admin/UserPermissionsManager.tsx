
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PermissionLegend } from "./PermissionLegend";
import { ModulePermissionTable } from "./ModulePermissionTable";
import { roles, defaultModules, AccessLevel, RolePermissionsState } from "./permissionTypes";

export function UserPermissionsManager() {
  const { toast } = useToast();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Initialize permissions state with default values
  const [permissions, setPermissions] = useState<RolePermissionsState>(() => {
    const initialState: RolePermissionsState = {};
    roles.forEach(role => {
      initialState[role] = {};
      defaultModules.forEach(module => {
        initialState[role][module.id] = module.defaultAccess[role];
      });
    });
    return initialState;
  });

  const handlePermissionChange = (role: string, moduleId: string, value: AccessLevel) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [moduleId]: value
      }
    }));
  };

  const savePermissions = () => {
    // Aquí deberías guardar los permisos en el backend
    console.log('Saving permissions:', permissions);
    toast({
      title: 'Permisos actualizados',
      description: 'Los permisos de los usuarios han sido actualizados correctamente.',
    });
  };

  const resetToDefaults = () => {
    const defaultState: RolePermissionsState = {};
    roles.forEach(role => {
      defaultState[role] = {};
      defaultModules.forEach(module => {
        defaultState[role][module.id] = module.defaultAccess[role];
      });
    });
    setPermissions(defaultState);
    toast({
      title: 'Permisos restablecidos',
      description: 'Los permisos han sido restablecidos a los valores predeterminados.',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Control de Acceso a Módulos</CardTitle>
        <CardDescription>
          Configure qué roles pueden acceder a cada módulo del sistema
        </CardDescription>
        <div className="flex items-center space-x-2 mt-4">
          <Switch id="advanced-mode" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
          <Label htmlFor="advanced-mode">Mostrar opciones avanzadas</Label>
        </div>
      </CardHeader>
      <CardContent>
        <ModulePermissionTable permissions={permissions} handlePermissionChange={handlePermissionChange} />

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={resetToDefaults}>
            Restablecer valores predeterminados
          </Button>
          <Button onClick={savePermissions}>
            Guardar cambios
          </Button>
        </div>

        {showAdvanced && <PermissionLegend />}
      </CardContent>
    </Card>
  );
}
