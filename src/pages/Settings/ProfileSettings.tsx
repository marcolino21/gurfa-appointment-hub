
import React from 'react';
import ProfileHeader from './components/ProfileHeader';
import ProfileForm from './components/ProfileForm';
import SubscriptionsList from './components/SubscriptionsList';
import { useProfileSettings } from './hooks/useProfileSettings';

const ProfileSettings = () => {
  const {
    formData,
    isLoading,
    isInitialLoading,
    profileImage,
    handleChange,
    handleFileUpload,
    handleSaveProfile
  } = useProfileSettings();
  
  return (
    <div className="space-y-8">
      {isInitialLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2 text-muted-foreground">Caricamento profilo...</span>
        </div>
      ) : (
        <>
          <ProfileHeader 
            businessName={formData.businessName} 
            address={formData.address}
            handleSaveProfile={handleSaveProfile}
            profileImage={profileImage}
            onFileUpload={handleFileUpload}
          />
          
          <div className="flex-1 space-y-6">
            <ProfileForm 
              formData={formData}
              handleChange={handleChange}
              handleSaveProfile={handleSaveProfile}
              isLoading={isLoading}
            />
          </div>

          <SubscriptionsList />
        </>
      )}
    </div>
  );
};

export default ProfileSettings;
