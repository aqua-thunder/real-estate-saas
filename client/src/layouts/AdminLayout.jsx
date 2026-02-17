import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import Header from "./Header.jsx";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="h-screen flex bg-slate-100 overflow-hidden">

            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Right Section */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header (fixed height) */}
                <Header onToggleSidebar={toggleSidebar} />

                {/* Main Content (ONLY THIS SCROLLS) */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[var(--bg-main)]">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default AdminLayout;
