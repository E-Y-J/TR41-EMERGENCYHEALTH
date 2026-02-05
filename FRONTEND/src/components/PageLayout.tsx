import React from 'react';
import Header from './Header';
import Footer from './Footer';

type PageLayoutProps = {
    children?: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className='mb-10 print:hidden'>
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
