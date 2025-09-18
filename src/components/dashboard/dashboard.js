

import React, { useState, useEffect } from 'react';
import DashboardRoutes from '../../Routing/dashboardRoutes';
import Sidebar from './sidebar';
import Header from './header';
import '../../App.css';
import '../../stylesheets/dashboard.css';
import { useLocation, useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();


    // Check for authentication token



    const [selectedComponent, setSelectedComponent] = useState(null);
    const [collapseSidebar] = useState(false);
    const [collapseSideSidebar] = useState(false)// Manage sidebar state

    const location = useLocation();
    const handleComponentSelect = (component) => {
        setSelectedComponent(component);
    };

    // Initialize selected component based on URL path
    if (selectedComponent == null) {
        const href = location.pathname.split('/')[2];
        setSelectedComponent(href);
    }

    
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <Sidebar handleComponentSelect={handleComponentSelect} />
            </div>

            {/* Main content area */}
            <div className="main-content">
                
                {/* Header */}
                <div className="header">
                    <Header />
                </div>

                {/* Content */}
                <div className="content">
                    <DashboardRoutes
                                    selectedComponent={selectedComponent}
                                    handleComponentSelect={handleComponentSelect}
                                />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;