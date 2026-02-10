import { useAuth } from "../hook/useAuth";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import AuthModal from "./Auth/AuthModal";
import "../styles/Header.css";

function Header() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen]);

  const activeLink = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-[#81c784]" : ""


  return (
    <>
      <header>
        <nav ref={navRef} className="ms-2 me-3 mt-2 relative">
          <NavLink to="/">
            <img src="/EmergiScanLogo.png" alt="Logo" className="navbar-logo pe-8" />
          </NavLink>

          <button
            className="md:hidden flex flex-col gap-1.5 px-6 pt-11 order-last"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="w-9 h-1 rounded-4xl bg-gray-700"></span>
            <span className="w-9 h-1 rounded-4xl bg-gray-700"></span>
            <span className="w-9 h-1 rounded-4xl bg-gray-700"></span>
          </button>

          <ul>
            {user && (
              <li>
                <span className="welcome text-2xl text-wrap p-6 text-center">Welcome, {user.first_name}!</span>
              </li>
            )}
            <div className="hidden md:flex whitespace-nowrap">

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
            </div>
          </ul>

          {/* hamburger menu */}
          {isMobileMenuOpen && (
            <ul className="md:hidden z-10 absolute top-20 w-48 right-0 bg-white flex flex-col">
              <li className="border-b border-gray-300">
                <NavLink to="/" className={activeLink} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="block p-4">Home</span>
                </NavLink>
              </li>
              <li className="border-b border-gray-300">
                <NavLink to="/my-qr" className={activeLink} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="block p-4">My QR Code</span>
                </NavLink>
              </li>
              <li className="border-b border-gray-300">
                <NavLink to="/account" className={activeLink} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="block p-4">Account</span>
                </NavLink>
              </li>
              <li className="border-b border-gray-300">
                <NavLink to="/chat-history" className={activeLink} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="block p-4">Chat History</span>
                </NavLink>
              </li>
              {user && (
                <li className="border-b border-gray-300">
                  <a onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block p-4">
                    Logout
                  </a>
                </li>

              )}
            </ul>
          )}
          {!user && (
            <div className="mobile-login md:hidden min-[399px]:flex-1 flex justify-center items-center">
              <a onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }} className="block min-[399px]:py-11 min-[399px]:text-center">
                Login / Sign Up
              </a>
            </div>
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