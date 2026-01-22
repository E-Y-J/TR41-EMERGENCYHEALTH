import React from 'react';
import Header from './Header';
import Footer from './Footer';

type PageLayoutProps = {
    children?: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* add the print hidden class to the header and footer so i can print the qr-code only */}
            <div className='mb-6 print:hidden'>
                <Header />
            </div>
            <div className="grow mx-6">
                {children}
            </div>
            <div className='print:hidden'>
                <Footer />
            </div>
        </div>
    );
};

export default PageLayout;
