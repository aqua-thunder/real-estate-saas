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
    Layers,
    Wrench,
    FileText,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth";
import Button from "../components/ui/Button";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["SUPER_ADMIN", "OWNER", "MANAGER"] },
    { name: "Users", icon: Users, path: "/users", roles: ["SUPER_ADMIN", "MANAGER", "OWNER"] },
    { name: "Property", icon: Building2, path: "/properties", roles: ["SUPER_ADMIN", "OWNER"] },
    { name: "Floor & Unit", icon: Building2, path: "/floor", roles: ["OWNER"] },
    { name: "Lease Management", icon: FileText, path: "/lease-agreement", roles: ["SUPER_ADMIN", "OWNER", "MANAGER"] },
    // { name: "Subscriptions", icon: CreditCard, path: "/subscriptions", roles: ["SUPER_ADMIN", "OWNER"] },
    { name: "Tenant", icon: UserCog, path: "/tenant", roles: ["SUPER_ADMIN", "OWNER", "MANAGER"] },
    { name: "Revenue Report", icon: CreditCard, path: "/revenue-report", roles: ["SUPER_ADMIN", "OWNER"] },
    { name: "Lease", icon: CreditCard, path: "/lease", roles: ["TENANT"] },
    { name: "Maintenance Request", icon: Wrench, path: "/maintenance", roles: ["TENANT", "MANAGER", "OWNER"] },
    { name: "Invoice", icon: CreditCard, path: "/invoice", roles: ["TENANT", "MANAGER"] },
    { name: "Profile & Security", icon: UserCog, path: "/profile", roles: ["SUPER_ADMIN", "OWNER", "MANAGER", "TENANT", "MAINTENANCE_STAFF"] },
];

const Sidebar = ({ isOpen, onClose }) => {
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
                className={`fixed z-50 lg:static top-0 left-0 h-full w-72 bg-white text-[var(--text-secondary)]
        transform transition-transform duration-300 ease-in-out border-r border-gray-100
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 flex flex-col font-['Inter']`}
            >
                {/* Header  */}
                <div className="flex items-center justify-between px-7 py-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-[var(--color-primary)] to-[#ff6b6b] rounded-xl shadow-lg shadow-[var(--color-primary)]/20 transition-transform hover:rotate-3">
                            <Layers size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[var(--color-secondary)] text-lg font-black tracking-tighter leading-none">EstateFlow</span>
                            <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                                {user?.role?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="xs"
                        iconOnly
                        icon={<X size={20} />}
                        onClick={onClose}
                        className="lg:hidden text-[var(--text-muted)]"
                    />
                </div>

                {/* Menu */}
                <nav className="flex-1 mt-4 px-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {filteredMenuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={index}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 group
                                    ${isActive
                                        ? "bg-[var(--color-primary)] text-white shadow-[0_12px_24px_-8px_rgba(231,76,60,0.4)] scale-[1.02] translate-x-1"
                                        : "text-[var(--text-muted)] hover:bg-gray-50 hover:text-[var(--color-secondary)] hover:translate-x-1"
                                    }`
                                }
                            >
                                <Icon size={18} className="transition-transform group-hover:scale-110" />
                                <span className="tracking-wide">{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>



                {/* Footer */}
                <div className="px-8 py-6 border-t border-gray-50 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-50">
                    © 2026 EstateFlow
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
