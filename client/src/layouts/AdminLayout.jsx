import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-slate-100">
            <AdminSidebar />

            <main className="flex-1 p-6 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
