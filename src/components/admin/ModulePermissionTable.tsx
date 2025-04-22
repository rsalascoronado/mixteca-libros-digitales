
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { roles, defaultModules, AccessLevel, RolePermissionsState } from "./permissionTypes";

interface Props {
  permissions: RolePermissionsState;
  handlePermissionChange: (role: string, moduleId: string, value: AccessLevel) => void;
}

export const ModulePermissionTable = ({ permissions, handlePermissionChange }: Props) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Módulo</TableHead>
          {roles.map(role => (
            <TableHead key={role} className="min-w-[140px] text-center capitalize">
              {role}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {defaultModules.map((module) => (
          <TableRow key={module.id}>
            <TableCell className="font-medium">
              <div>
                <div>{module.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{module.description}</div>
              </div>
            </TableCell>
            {roles.map(role => (
              <TableCell key={`${module.id}-${role}`} className="text-center">
                <ToggleGroup
                  type="single"
                  value={permissions[role][module.id]}
                  onValueChange={(value) => {
                    if (value) handlePermissionChange(role, module.id, value as AccessLevel);
                  }}
                  className="justify-center"
                >
                  <ToggleGroupItem value="permitir" aria-label="Permitir" className="px-2 py-1 text-xs data-[state=on]:bg-green-100 data-[state=on]:text-green-700">
                    Permitir
                  </ToggleGroupItem>
                  <ToggleGroupItem value="restringir" aria-label="Restringir" className="px-2 py-1 text-xs data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-700">
                    Restringir
                  </ToggleGroupItem>
                  <ToggleGroupItem value="ocultar" aria-label="Ocultar" className="px-2 py-1 text-xs data-[state=on]:bg-red-100 data-[state=on]:text-red-700">
                    Ocultar
                  </ToggleGroupItem>
                </ToggleGroup>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
