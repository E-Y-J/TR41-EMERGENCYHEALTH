import { useAuth } from "../hook/useAuth";
import { useState } from "react";
import AuthModal from "./Auth/AuthModal";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenQr = () => {
    window.open("/my-qr", "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <header>
        <nav>
          <img src="/EmergiScanLogo.png" alt="Logo" className="navbar-logo" />
          {user ? (
            <ul>
              <p>Welcome, {user.first_name}!</p>
              <li>
                <a onClick={logout}>Logout</a>
              </li>
              <li>
                <button onClick={handleOpenQr}>View / Print QR Code</button>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <a onClick={() => setIsAuthModalOpen(true)}>Login / Sign Up</a>
              </li>
            </ul>
          )}
        </nav>
      </header>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
