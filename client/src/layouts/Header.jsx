import React, { useState } from "react";
import { Search, Mail, Bell, User, ChevronDown, Menu, Layers } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../store/auth.jsx";



const Header = ({ onToggleSidebar }) => {
    const [openAccount, setOpenAccount] = useState(false);
    const { user } = useAuth();

    return (
        <header className="w-full bg-[var(--bg-card)] border-b border-[var(--color-card)] px-4 md:px-8 py-4 flex items-center justify-between">

            {/* LEFT SIDE — Hamburger + Search */}
            <div className="flex items-center gap-3 flex-1">
                {/* Hamburger Menu (Mobile Only) */}
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-card)] transition-colors"
                >
                    <Menu size={24} className="text-[var(--text-secondary)]" />
                </button>

                {/* 🔍 SEARCH */}
                <div className="relative w-full max-w-xs md:max-w-md">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-card)]"
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--color-card)] bg-[var(--bg-card)] text-[var(--text-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    />
                </div>
            </div>


            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4 md:gap-6 ml-4">

                {/* Inbox */}
                <button className="relative p-2 rounded-xl hover:bg-[var(--color-card)] transition-all">
                    <Mail size={20} className="text-[var(--text-secondary)]" />
                    <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-[var(--text-secondary)] text-[10px] px-1.5 py-0.5 rounded-full">
                        3
                    </span>
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-[var(--color-card)] transition-all">
                    <Bell size={20} className="text-[var(--text-secondary)]" />
                    <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-[var(--text-secondary)] text-[10px] px-1.5 py-0.5 rounded-full">
                        5
                    </span>
                </button>

                {/* Account Dropdown */}
                <div className="relative">
                    <button onMouseEnter={() => setOpenAccount(!openAccount)}   className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--color-card)] transition-all cursor-pointer">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--text-secondary)]">
                            <User size={16} />
                        </div>

                    </button>

                    {/* Dropdown Menu */}
                    {openAccount && (
                        <div className="absolute right-2 sm:right-0 mt-3 w-[90vw] sm:w-72 max-w-sm  bg-[var(--bg-main)] border border-[var(--color-main)]  rounded-2xl shadow-xl z-50 p-5  transition-all duration-200 ease-out shadow shadow-gray-700 space-y-5" onMouseLeave={() => { setOpenAccount(!openAccount) }}>

                            {/* Title */}
                            <h2 className="text-[var(--text-secondary)] text-lg font-semibold">
                                User Profile
                            </h2>

                            {/* User Info */}
                            <div className="flex items-center gap-4 mt-5">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--color-primary)]  text-white shrink-0">
                                    <User/>
                                </div>

                                <div className="flex flex-col overflow-hidden space-y-1">
                                    <span className="text-[var(--text-secondary)] font-medium truncate">
                                        {user.name}
                                    </span>
                                    <span className="text-[var(--text-card)] text-xs capitalize">
                                        {user.role}
                                    </span>
                                    <span className="text-[var(--text-card)] text-xs truncate">
                                        {user.email}
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="my-5 h-[1px] bg-gray-600"></div>

                            <NavLink to="/admin/profile" className="flex items-center space-x-5 cursor-pointer">
                                <div className="p-3 bg-[var(--color-primary)]/10 rounded-2xl text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                                    <Layers size={22} />
                                </div>
                                <div className="">
                                    <div className="text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)]">My Profile</div>
                                    <div className="text-[var(--text-card)] text-xs">Account Settings</div>
                                </div>
                            </NavLink>

                            {/* Logout Button */}
                            <NavLink
                                to="/logout"
                                className="block w-full text-center px-4 py-2.5  text-sm font-medium rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-all duration-200"
                            >
                                Logout
                            </NavLink>
                        </div>

                    )}
                </div>

            </div>
        </header>
    );
};

export default Header;
