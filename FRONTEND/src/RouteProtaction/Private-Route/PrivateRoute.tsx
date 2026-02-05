import React, { useState} from "react";
import AuthModal from "../../components/Auth/AuthModal";
import { useAuth } from "../../hook/useAuth";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(true);

  // If not authenticated or there is no token, show auth modal
  if (!user || !token) {

    // If modal is closed, redirect to home
    if (!isAuthModalOpen) {
      return <Navigate to="/" replace />;
    }
    
    return (
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)} 
      />
    );
  }

  return children;
};

export default PrivateRoute;