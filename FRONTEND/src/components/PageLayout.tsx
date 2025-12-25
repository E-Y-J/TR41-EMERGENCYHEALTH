import React from 'react';
import Header from './Header';

type PageLayoutProps = {
    children?: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return (
        <>
            <div>
                <div>
                    <Header />
                </div>
                <div>
                    {children}
                </div>
            </div>
        </>
    );
};

export default PageLayout;
