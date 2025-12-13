import React from "react";
import { ProfileForm } from "./components/ProfileForm";

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;
