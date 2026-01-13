import { useAuth } from "../hook/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./Auth/AuthModal";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


  return (
    <>
      <header>
        <nav className="ms-2 me-3">
          <Link to="/">
            <img src="/EmergiScanLogo.png" alt="Logo" className="navbar-logo" />
          </Link>
          {user ? (
            <ul>
              <li>
                <span className="text-2xl p-6">Welcome, {user.first_name}!</span>
              </li>
              <li>
                <Link to="/my-qr">My QR Code</Link>
              </li>
              <li>
                <Link to="/account">Account</Link>
              </li>
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
