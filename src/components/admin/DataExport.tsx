
import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';

interface DataExportProps {
  data: any[];
  filename: string;
  buttonLabel?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

const DataExport: React.FC<DataExportProps> = ({ 
  data, 
  filename, 
  buttonLabel = 'Exportar datos', 
  variant = 'outline' 
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  const exportToJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${filename}.json`);
  };

  const exportToCSV = () => {
    // Convert data to CSV format
    const replacer = (key: string, value: any) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => 
      JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvString = csv.join('\r\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm">
          <Download className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          Exportar como JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          Exportar como Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataExport;
