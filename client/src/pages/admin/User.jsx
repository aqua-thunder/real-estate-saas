import React from 'react';
import { UserPlus, Search, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../store/auth';


const User = () => {
    const {owners} = useAuth();
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage system users and their roles</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
                    <UserPlus size={18} />
                    <span>Add User</span>
                </button>
            </div>

            <div className="p-4">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 text-sm font-semibold uppercase">
                                <th className="p-4 border-b">Owner Type</th>
                                <th className="p-4 border-b">Comapny Name</th>
                                <th className="p-4 border-b">contactNumber</th>
                                <th className="p-4 border-b">Status</th>
                                <th className="p-4 border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {owners.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors text-sm text-slate-700">
                                    <td className="p-4 border-b font-medium">{user.ownerType}</td>
                                    <td className="p-4 border-b">{user.companyName}</td>
                                    <td className="p-4 border-b">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">
                                            {user.contactNumber}
                                        </span>
                                    </td>
                                    <td className="p-4 border-b">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 border-b text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-rose-600">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default User;
