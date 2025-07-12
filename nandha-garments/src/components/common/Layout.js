import React from 'react';
import Header from './Header';

const Layout = ({ children, userType }) => {
  return (
    <div className="layout">
      <Header userType={userType} />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;