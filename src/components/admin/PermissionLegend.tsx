
import React from "react";

export const PermissionLegend = () => (
  <div className="mt-6 border rounded-md p-4">
    <h3 className="text-lg font-medium mb-4">Explicación de niveles de acceso</h3>
    <ul className="space-y-2">
      <li className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="font-medium">Permitir:</span> 
        <span className="text-sm">El usuario puede ver y utilizar completamente el módulo.</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className="font-medium">Restringir:</span> 
        <span className="text-sm">El usuario puede ver el módulo, pero con funcionalidad limitada.</span>
      </li>
      <li className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="font-medium">Ocultar:</span> 
        <span className="text-sm">El módulo no será visible para el usuario.</span>
      </li>
    </ul>
  </div>
);
