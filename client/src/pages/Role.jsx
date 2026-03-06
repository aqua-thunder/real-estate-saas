import React from 'react';
import { Shield, Plus } from 'lucide-react';

const roles = [
    { title: "Super Admin", users: 2, desc: "Full access to all implementing features." },
    { title: "Property Manager", users: 5, desc: "Can manage properties and tenants." },
    { title: "Technician", users: 8, desc: "Access to maintenance tickets only." },
    { title: "Viewer", users: 12, desc: "Read-only access to specific modules." },
];

const Role = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Page Header Area */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            Roles & Permissions
                        </h1>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
                    <Plus size={18} />
                    <span>Create Role</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role, idx) => (
                    <div key={idx} className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--color-card)] hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-[var(--color-card)] text-[var(--text-secondary)] rounded-lg">
                                <Shield size={24} />
                            </div>
                            <span className="text-xs font-semibold text-[var(--text-secondary)]">{role.users} Users</span>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-secondary)] mb-2">{role.title}</h3>
                        <p className="text-[var(--text-card)] text-sm mb-4">{role.desc}</p>
                        <button className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-card)]">
                            Edit Permissions &rarr;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Role;
