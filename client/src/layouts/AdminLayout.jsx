import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import Header from "./Header.jsx";

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-slate-100">
            <AdminSidebar />

            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 lg:p-8 bg-[var(--bg-main)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
