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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Roles & Permissions</h2>
                    <p className="text-slate-500 text-sm mt-1">Define roles and assign permissions to users.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
                    <Plus size={18} />
                    <span>Create Role</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Shield size={24} />
                            </div>
                            <span className="text-xs font-semibold text-slate-500">{role.users} Users</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{role.title}</h3>
                        <p className="text-slate-600 text-sm mb-4">{role.desc}</p>
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                            Edit Permissions &rarr;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Role;
