import React from 'react';
import Header from './Header';
import Footer from './Footer';

type PageLayoutProps = {
    children?: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <div>
                <Header />
            </div>
            <div className="grow">
                {children}
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default PageLayout;
