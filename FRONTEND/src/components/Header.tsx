import { useAuth } from "../hook/useAuth";
import { useState } from "react";
import AuthModal from "./Auth/AuthModal";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
