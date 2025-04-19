
import React, { useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import PDFViewer from '@/components/shared/PDFViewer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { saveAs } from 'file-saver';

interface HelpSection {
  title: string;
  content: string[];
}

interface RoleHelp {
  role: UserRole;
  sections: HelpSection[];
}

const helpContent: RoleHelp[] = [
  {
    role: 'estudiante',
    sections: [
      {
        title: 'Préstamos',
        content: [
          'Puedes solicitar hasta 3 libros por un período de 14 días.',
          'Debes presentar tu credencial vigente para realizar préstamos.',
          'Puedes renovar tus préstamos hasta 2 veces si no hay reservas.'
        ]
      },
      {
        title: 'Catálogo',
        content: [
          'Accede al catálogo completo de libros y tesis.',
          'Utiliza los filtros para encontrar material específico.',
          'Puedes ver la disponibilidad en tiempo real.'
        ]
      }
    ]
  },
  {
    role: 'profesor',
    sections: [
      {
        title: 'Préstamos',
        content: [
          'Puede solicitar hasta 5 libros por un período de 30 días.',
          'Tiene prioridad en las reservas de material.',
          'Puede solicitar material especial para clases.'
        ]
      },
      {
        title: 'Recursos adicionales',
        content: [
          'Acceso a bases de datos especializadas.',
          'Solicitud de material bibliográfico nuevo.',
          'Reserva de espacios de estudio.'
        ]
      }
    ]
  },
  {
    role: 'bibliotecario',
    sections: [
      {
        title: 'Gestión de préstamos',
        content: [
          'Registro y control de préstamos y devoluciones.',
          'Gestión de multas y sanciones.',
          'Seguimiento de material no devuelto.'
        ]
      },
      {
        title: 'Administración',
        content: [
          'Actualización del catálogo.',
          'Gestión de usuarios.',
          'Generación de reportes.'
        ]
      }
    ]
  },
  {
    role: 'administrador',
    sections: [
      {
        title: 'Configuración del sistema',
        content: [
          'Gestión de roles y permisos.',
          'Configuración de políticas de préstamo.',
          'Administración de usuarios del sistema.'
        ]
      },
      {
        title: 'Reportes y estadísticas',
        content: [
          'Generación de reportes detallados.',
          'Análisis de uso de la biblioteca.',
          'Estadísticas de préstamos y usuarios.'
        ]
      }
    ]
  }
];

const Ayuda = () => {
  const { user, hasRole } = useAuth();
  const currentRole = user?.role || 'estudiante';

  const downloadPDF = useCallback((role: UserRole) => {
    // En una implementación real, esto descargaría el PDF correspondiente
    const blob = new Blob(['Contenido del PDF para ' + role], { type: 'application/pdf' });
    saveAs(blob, `manual_${role}.pdf`);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Centro de Ayuda</h1>
        
        <Tabs defaultValue={currentRole} className="w-full">
          <TabsList className="mb-4">
            {helpContent.map(({ role }) => (
              hasRole([role, 'administrador']) && (
                <TabsTrigger key={role} value={role} className="capitalize">
                  {role}
                </TabsTrigger>
              )
            ))}
          </TabsList>

          {helpContent.map(({ role, sections }) => (
            hasRole([role, 'administrador']) && (
              <TabsContent key={role} value={role}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold capitalize">Manual de {role}</h2>
                  <div className="flex gap-2">
                    <PDFViewer 
                      url={`/manuales/${role}.pdf`} 
                      fileName={`Manual de ${role}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPDF(role)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {sections.map((section, index) => (
                    <AccordionItem key={index} value={`section-${index}`}>
                      <AccordionTrigger>{section.title}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-6 space-y-2">
                          {section.content.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            )
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Ayuda;
