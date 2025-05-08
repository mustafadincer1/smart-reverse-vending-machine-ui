import React from 'react';
import './Layout.css';

const Layout = ({ children }) => (
    <div className="app-background">
        <header className="app-header">
            <h1>Akıllı Geri Dönüşüm Otomatı</h1>
            <img
                src={`${process.env.PUBLIC_URL}/ikons/atkazan.png`}
                alt="At Kazan Logo"
                className="header-logo"
            />
        </header>
        <main className="main section hero">
            {children}
        </main>
    </div>
);

export default Layout;