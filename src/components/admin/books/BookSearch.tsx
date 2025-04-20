
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BookSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BookSearch({ value, onChange }: BookSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar por título, autor o ISBN..."
        className="pl-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

