import React from 'react';
import { User, Lock, Mail, Camera } from 'lucide-react';

const Profile = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Profile & Security</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto flex items-center justify-center text-slate-400">
                                <User size={48} />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md">
                                <Camera size={16} />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Admin User</h3>
                        <p className="text-slate-500 text-sm mb-4">admin@example.com</p>
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Super Admin
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <User size={20} className="text-indigo-600" />
                            Personal Information
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                    <input type="text" defaultValue="Admin" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                    <input type="text" defaultValue="User" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <input type="email" defaultValue="admin@example.com" className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                                    <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mt-8 mb-6 flex items-center gap-2">
                            <Lock size={20} className="text-indigo-600" />
                            Security
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
