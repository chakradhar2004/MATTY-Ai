import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationContainer from '../UI/NotificationContainer';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { sidebarOpen, rightPanelOpen } = useSelector((state) => state.ui);
  const { theme } = useSelector((state) => state.ui);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''} bg-background text-foreground transition-colors duration-200`}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-card border-r border-border flex-shrink-0`}>
          <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar removed globally */}

        {/* Main content */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 overflow-auto p-4">
            {children || <Outlet />}
          </div>
          
          {/* Right panel removed globally */}
        </div>
      </div>
      
      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
};


export default Layout;
