import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Lock, Globe } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <SettingsIcon className="text-indigo-600" size={24} />
                    <h2 className="text-lg font-bold text-slate-800">Settings</h2>
                </div>
                <nav className="space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
                {activeTab === 'general' && (
                    <div className="space-y-6 max-w-2xl">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">General Settings</h3>
                            <p className="text-slate-500 text-sm">Configure basic site information.</p>
                        </div>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                                <input type="text" defaultValue="Real Estate SaaS" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Support Email</label>
                                <input type="email" defaultValue="support@example.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                                    <option>UTC (Coordinated Universal Time)</option>
                                    <option>EST (Eastern Standard Time)</option>
                                    <option>PST (Pacific Standard Time)</option>
                                </select>
                            </div>
                            <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors w-max">
                                <Save size={18} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                )}
                {/* Other tabs can be implemented similarly */}
                {activeTab !== 'general' && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <SettingsIcon size={48} className="mb-4 opacity-20" />
                        <p>Settings for {activeTab} go here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
