import { Link } from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-lg mb-3">Emergency Health</h4>
                        <p className="text-gray-400 text-sm">
                            Quick access to your medical information for Emergency Responders.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-3 font-semibold align-bottom">Quick Links</h4>
                        <ul className="space-y-1">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/account" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-qr" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    My QR Code
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Contact</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>Email: support@emergiscan.com</li>
                            <li>Phone: (555) 123-4567</li>
                            <li>Emergency: 911</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 pt-6 text-center text-gray-400 text-sm">
                    <p>&copy; {currentYear} EmergiScan. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
