
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Download } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface ProfileHeaderProps {
  businessName: string;
  address: string;
  handleSaveProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  businessName, 
  address, 
  handleSaveProfile 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0">
        <Avatar className="w-24 h-24">
          <AvatarImage src="/lovable-uploads/af963a36-81dd-4b66-ae94-4567f5f8d150.png" alt={businessName} />
          <AvatarFallback>{businessName?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex-1 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">{businessName || "Gurfa Beauty Concept"}</h2>
            <p className="text-sm text-muted-foreground">
              {address || "Via Fiume Giallo, 405, 00144 Roma, Italia"}
            </p>
            <a href="#" className="text-sm text-blue-500 hover:underline">VEDI PROFILO ONLINE</a>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="icon" onClick={handleSaveProfile}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
