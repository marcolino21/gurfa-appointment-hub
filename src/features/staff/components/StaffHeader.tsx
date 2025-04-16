
import React, { useState, useEffect } from 'react';
import { CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface StaffHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAddStaffClick: () => void;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onAddStaffClick
}) => {
  const [businessName, setBusinessName] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the business name from localStorage
    const savedBusinessName = localStorage.getItem('salon_business_name');
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
    }
  }, []);
  
  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle>Staff {businessName && `- ${businessName}`}</CardTitle>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca membro dello staff..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={onAddStaffClick}>
          <Plus className="h-4 w-4 mr-2" /> Aggiungi membro
        </Button>
      </div>
    </div>
  );
};

export default StaffHeader;
