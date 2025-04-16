
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProfessionalsHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ProfessionalsHeader: React.FC<ProfessionalsHeaderProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle>Professionisti</CardTitle>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca professionista..."
          className="pl-8 w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProfessionalsHeader;
