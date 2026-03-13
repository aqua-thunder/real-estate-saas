import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { pathname } = useLocation();
    const mainRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo(0, 0);
        }
    }, [pathname]);

    return (
        <div className="h-screen flex bg-slate-100 overflow-hidden">

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Right Section */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header (fixed height) */}
                <Header onToggleSidebar={toggleSidebar} />

                {/* Main Content (ONLY THIS SCROLLS) */}
                <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[var(--bg-main)]">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default Layout;
