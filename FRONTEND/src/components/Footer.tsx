import { useState } from 'react'
import { Link } from "react-router-dom";
import AuthModal from "./Auth/AuthModal";
import { useAuth } from '../hook/useAuth';
import '../styles/Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


    return (
        <footer className="mt-10 text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-lg mb-3">Emergency Health</h4>
                        <p className="text-gray-400 text-xs">
                            Quick access to your medical information <br /> for Emergency Responders.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-3 font-semibold align-bottom">Quick Links</h4>
                        <ul className="spacing">
                            {!user && (
                                <li>
                                    <a className="text-gray-400 text-xs hover:text-[#81c784] cursor-pointer" onClick={() => setIsAuthModalOpen(true)}>Login / Sign Up</a>
                                </li>
                            )}
                            <>
                                <li>
                                    <Link to="/" className="text-gray-400 hover:text-[#81c784] text-xs transition-colors">Home</Link>
                                </li>
                                <li>
                                    <Link to="/my-qr" className="text-gray-400 hover:text-[#81c784] text-xs transition-colors">
                                        My QR Code
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/account" className="text-gray-400 hover:text-[#81c784] text-xs transition-colors">
                                        Account
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/chat-history" className="text-gray-400 hover:text-[#81c784] text-xs transition-colors">
                                        Chat History
                                    </Link>
                                </li>
                            </>
                        </ul>
                        <AuthModal
                            isOpen={isAuthModalOpen}
                            onClose={() => setIsAuthModalOpen(false)} />
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Contact</h4>
                        <ul className="space-y-2 text-gray-400 text-xs">
                            <li>Email: support@emergiscan.com</li>
                            <li>Phone: (555) 123-4567</li>
                            <li>Emergency: 911</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 pt-6 text-center text-gray-400 text-xs">
                    <p>&copy; {currentYear} EmergiScan. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
