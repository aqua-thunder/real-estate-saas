import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

const stats = [
    { label: "Total Revenue", value: "$124,500", icon: DollarSign, color: "bg-emerald-500", change: "+12.5%" },
    { label: "Active Users", value: "2,400", icon: Users, color: "bg-indigo-500", change: "+5.2%" },
    { label: "New Leads", value: "350", icon: TrendingUp, color: "bg-amber-500", change: "+18.1%" },
    { label: "Reports Generated", value: "1,240", icon: BarChart3, color: "bg-rose-500", change: "+3.4%" },
];

const Reports = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Global Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                                    <Icon size={24} />
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Placeholder for a Chart */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center min-h-[400px]">
                <div className="text-center text-slate-400">
                    <BarChart3 size={64} className="mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-slate-600">Analytics Dashboard</h3>
                    <p className="text-sm">Comprehensive charts and graphs would be displayed here.</p>
                </div>
            </div>
        </div>
    );
};

export default Reports;
