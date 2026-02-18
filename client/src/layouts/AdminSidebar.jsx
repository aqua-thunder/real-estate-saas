import React from "react";
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
    X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", roles: ["SUPER_ADMIN", "OWNER", "MANAGER", "TENANT", "TECHNICIAN"] },
    { name: "Users", icon: Users, path: "/admin/users", roles: ["SUPER_ADMIN", "MANAGER"] },
    { name: "Role", icon: ShieldCheck, path: "/admin/roles", roles: ["SUPER_ADMIN"] },
    { name: "Location", icon: MapPin, path: "/admin/locations", roles: ["SUPER_ADMIN", "OWNER", "MANAGER", "TECHNICIAN"] },
    { name: "Property", icon: Building2, path: "/admin/properties", roles: ["SUPER_ADMIN", "OWNER", "MANAGER", "TENANT"] },
    { name: "Settings", icon: Settings, path: "/admin/settings", roles: ["SUPER_ADMIN"] },
    { name: "Reports", icon: BarChart3, path: "/admin/reports", roles: ["SUPER_ADMIN", "OWNER", "MANAGER"] },
    { name: "Subscriptions", icon: CreditCard, path: "/admin/subscriptions", roles: ["SUPER_ADMIN", "OWNER"] },
    { name: "Audit Logs", icon: FileSearch, path: "/admin/audit-logs", roles: ["SUPER_ADMIN"] },
    { name: "Profile & Security", icon: UserCog, path: "/admin/profile", roles: ["SUPER_ADMIN", "OWNER", "MANAGER", "TENANT", "TECHNICIAN"] },
];

const AdminSidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const userRole = user?.role || "TENANT";

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

    return (
        <>
            {/* Overlay (Mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-50 lg:static top-0 left-0 h-full w-72 bg-[var(--color-card)] text-[var(--text-secondary)]
        transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 flex flex-col`}
            >
                {/* Header  */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-slate-700/50">
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)] font-[var(--font-heading)]">Admin Panel</h2>
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
                    {filteredMenuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={index}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3.5 rounded-full text-sm font-medium transition-all duration-300  group
                   ${isActive
                                        ? "bg-[#17344f] text-[var(--text-primary)] shadow-lg translate-x-1 "
                                        : "hover:bg-slate-800/50 hover:text-white hover:translate-x-1 text-[var(--text-secondary)]"
                                    }`
                                }
                            >
                                <Icon size={20} className={`transition-colors ${
                                    // You can add logic here if you want icon color to change differently
                                    ""
                                    }`} />
                                <span className="font-[var(--font-body)]">{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>



                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-800 text-xs text-slate-400">
                    © 2026 Your SaaS
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
