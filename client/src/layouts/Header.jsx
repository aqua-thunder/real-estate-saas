import React, { useState } from "react";
import { Search, Mail, Bell, User, ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

const Header = () => {
    const [openAccount, setOpenAccount] = useState(false);

    return (
        <header className="w-full bg-[var(--bg-card)] border-b border-[var(--color-card)] px-4 md:px-8 py-4 flex items-center justify-between">

            {/* 🔍 LEFT SIDE — SEARCH */}
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

            {/* 🔔 RIGHT SIDE */}
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
                    <button
                        onClick={() => setOpenAccount(!openAccount)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--color-card)] transition-all"
                    >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--text-secondary)]">
                            <User size={16} />
                        </div>

                    </button>

                    {/* Dropdown Menu */}
                    {openAccount && (
                        <div className="absolute right-0 mt-2 w-44 bg-[var(--bg-card)] border border-[var(--color-card)] rounded-xl shadow-lg overflow-hidden z-50">
                            <button className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--color-card)] transition-all">
                                Profile
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--color-card)] transition-all">
                                Settings
                            </button>
                            <NavLink to="/logout" className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[var(--color-card)] transition-all">
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
