import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div>
            <h2>Admin Panel</h2>
            {/* sidebar / navbar later */}
            <Outlet />
        </div>
    );
};

export default AdminLayout;
