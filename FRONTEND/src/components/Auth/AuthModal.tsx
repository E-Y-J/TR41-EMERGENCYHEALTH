import React from 'react';
import AuthContainer from './AuthContainer';
import '../../styles/AuthModal.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    x
                </button>
                <AuthContainer onClose={onClose} />
            </div>
        </div>
    );
};

export default AuthModal;
