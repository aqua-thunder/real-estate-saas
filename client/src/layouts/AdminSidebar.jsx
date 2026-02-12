import React from "react";
import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    MapPin,
    Building2,
    Settings,
    BarChart3,
    CreditCard,
    FileSearch,
    UserCog,
    Menu,
    X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "User Management", icon: Users, path: "/admin/users" },
    { name: "Role & Permission", icon: ShieldCheck, path: "/admin/roles" },
    { name: "Location Management", icon: MapPin, path: "/admin/locations" },
    { name: "Property Overview", icon: Building2, path: "/admin/properties" },
    { name: "System Settings", icon: Settings, path: "/admin/settings" },
    { name: "Global Reports", icon: BarChart3, path: "/admin/reports" },
    { name: "Subscriptions", icon: CreditCard, path: "/admin/subscriptions" },
    { name: "Audit Logs", icon: FileSearch, path: "/admin/audit-logs" },
    { name: "Profile & Security", icon: UserCog, path: "/admin/profile" },
];

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3">
                <h1 className="text-lg font-semibold">Admin Panel</h1>
                <button onClick={() => setIsOpen(true)}>
                    <Menu size={24} />
                </button>
            </div>

            {/* Overlay (Mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-50 lg:static top-0 left-0 h-full w-72 bg-slate-900 text-slate-200
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                    <button className="lg:hidden" onClick={() => setIsOpen(false)}>
                        <X size={22} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="mt-4 px-3 space-y-1">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={index}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                   transition-all duration-200
                   ${isActive
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "hover:bg-slate-800 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 w-full px-6 py-4 border-t border-slate-800 text-xs text-slate-400">
                    © 2026 Your SaaS
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
