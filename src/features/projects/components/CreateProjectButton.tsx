
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Folders } from 'lucide-react';

interface CreateProjectButtonProps {
  clientId: string;
  className?: string;
}

const CreateProjectButton: React.FC<CreateProjectButtonProps> = ({ clientId, className }) => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate(`/progetti/nuovo?clientId=${clientId}`);
  };

  return (
    <Button 
      onClick={handleCreateProject} 
      size="sm" 
      variant="ghost" 
      className={className}
    >
      <Folders className="h-4 w-4 mr-2" />
      Crea progetto
    </Button>
  );
};

export default CreateProjectButton;
