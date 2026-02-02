import { useAuth } from "../hook/useAuth";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import AuthModal from "./Auth/AuthModal";
import "../styles/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const activeLink = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-[#81c784]" : ""

  return (
    <>
      <header>
        <nav className="ms-2 me-3">
          <NavLink to="/">
            <img src="/EmergiScanLogo.png" alt="Logo" className="navbar-logo" />
          </NavLink>
          <ul>
            {user && (
              <li>
                <span className="text-2xl p-6">Welcome, {user.first_name}!</span>
              </li>
            )}
            <li>
              <NavLink to="/" className={activeLink}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/my-qr" className={activeLink}>My QR Code</NavLink>
            </li>
            <li>
              <NavLink to="/account" className={activeLink}>Account</NavLink>
            </li>
            <li>
              <NavLink to="/chat-history" className={activeLink}>Chat History</NavLink>
            </li>
            {user && (
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            )}
            {!user && (
              <li>
                <a onClick={() => setIsAuthModalOpen(true)}>Login / Sign Up</a>
              </li>
            )}
          </ul>

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