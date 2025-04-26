
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Download, Camera, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  businessName: string;
  address: string;
  handleSaveProfile: () => void;
  profileImage: string | null;
  onFileUpload: (file: File) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  businessName, 
  address, 
  handleSaveProfile,
  profileImage,
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        await onFileUpload(files[0]);
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-shrink-0 relative">
        <Avatar 
          className={`w-24 h-24 cursor-pointer transition-opacity duration-200 ${isUploading ? 'opacity-50' : ''}`} 
          onClick={handleAvatarClick}
        >
          <AvatarImage src={profileImage || "/lovable-uploads/19614d1f-2829-41dc-adfc-940ca688a2f2.png"} alt={businessName} />
          <AvatarFallback>
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              businessName?.slice(0, 2).toUpperCase()
            )}
          </AvatarFallback>
          {!isUploading && (
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer">
              <Camera className="h-4 w-4" />
            </div>
          )}
        </Avatar>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={isUploading}
        />
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
