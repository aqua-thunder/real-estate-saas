import React from "react";
import AdminSidebar from "./AdminSidebar.jsx";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <AdminSidebar />

            <main className="flex-1 p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
