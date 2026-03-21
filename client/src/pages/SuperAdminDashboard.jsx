import React, { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Building2,
    Users,
    IndianRupee,
    UserCheck,
    TrendingUp,
    PieChart as PieChartIcon,
    Calendar,
    CheckCircle2,
    Clock,
    Loader2,
    Briefcase,
    Home,
    Layers,
    Globe,
    ShieldCheck,
    ArrowUpRight,
    Search,
    Filter,
    Activity,
    Navigation,
    MoreHorizontal
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";

export default function SuperAdminDashboard() {
    const { token, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [growthData, setGrowthData] = useState([]);
    const [propertyDistribution, setPropertyDistribution] = useState([]);
    const [recentOwners, setRecentOwners] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:7000/api/admin/dashboard-stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data.summary);

                // Process growth data for chart
                const months = [...new Set([
                    ...data.growth.userGrowth.map(d => d._id),
                    ...data.growth.propertyGrowth.map(d => d._id)
                ])].sort();

                const combinedGrowth = months.map(month => {
                    const userData = data.growth.userGrowth.find(d => d._id === month);
                    const propertyData = data.growth.propertyGrowth.find(d => d._id === month);
                    return {
                        month,
                        users: userData ? userData.count : 0,
                        properties: propertyData ? propertyData.count : 0
                    };
                });
                setGrowthData(combinedGrowth);

                // Process property distribution for pie chart
                const dist = data.propertyDistribution.map(item => ({
                    name: item._id.charAt(0) + item._id.slice(1).toLowerCase(),
                    value: item.count
                }));
                setPropertyDistribution(dist);

                setRecentOwners(data.recentOwners);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            toast.error("Failed to load dashboard statistics");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveOwner = async (ownerId) => {
        try {
            const response = await fetch(`http://localhost:7000/api/admin/owner/${ownerId}/approve`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success("Owner approved successfully");
                fetchDashboardData();
            } else {
                toast.error("Failed to approve owner");
            }
        } catch (error) {
            toast.error("An error occurred while approving owner");
        }
    };

    useEffect(() => {
        if (token) fetchDashboardData();
    }, [token]);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[var(--bg-main)] font-['Inter']">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] animate-pulse">Initializing Platform Intelligence...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-main)] p-4 sm:p-6 lg:p-2 space-y-12 font-['Inter']">

            {/* Global Command Header */}
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
                <div className="space-y-3">
                    <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-secondary)] tracking-tighter">Dashboard</h1>
                </div>
            </header>

            {/* Platform Health Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "blue", trend: "+5.1%", desc: "Platform users" },
                    { label: "Total Owners", value: stats?.totalOwners || 0, icon: UserCheck, color: "indigo", trend: "+2.3%", desc: "Verified hosts" },
                    { label: "Total Properties", value: stats?.totalProperties || 0, icon: Building2, color: "emerald", trend: "+8.7%", desc: "Live properties" },
                    { label: "Total Tenants", value: stats?.totalTenants || 0, icon: Layers, color: "amber", trend: "+4.2%", desc: "Active tenants" },
                    { label: "Total Revenue", value: `₹${stats?.monthlyRevenue?.toLocaleString() || 0}`, icon: IndianRupee, color: "rose", trend: "+14%", desc: "Network revenue" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] group transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col justify-between min-h-[150px]">
                        <div className="flex items-center justify-between relative z-10 mb-6">
                            <div className={`p-5 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 border border-${stat.color}-100 transition-all duration-700 group-hover:bg-gray-900 group-hover:text-white group-hover:shadow-xl`}>
                                <stat.icon size={15} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-[var(--color-secondary)] tracking-tight tabular-nums mb-1 transition-all group-hover:translate-x-1">{stat.value}</h3>
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Strategic Analytics Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Network Growth Curve */}
                <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col min-h-[550px]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16 relative z-10">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-[var(--color-secondary)] flex items-center gap-4">
                                Network Velocity <TrendingUp className="text-indigo-600 animate-bounce" size={32} />
                            </h2>
                            <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40 italic">Cross-metric growth trajectory mapping</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                <span className="text-[9px] font-black uppercase text-indigo-800">New Users</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                                <span className="text-[9px] font-black uppercase text-emerald-800">New Assets</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full mt-auto relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData.length > 0 ? growthData : []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="userCurve" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="propCurve" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    fontWeight="black"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={20}
                                    tickFormatter={(str) => {
                                        const [year, month] = str.split('-');
                                        const date = new Date(year, month - 1);
                                        return date.toLocaleDateString('default', { month: 'short' }).toUpperCase();
                                    }}
                                />
                                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', borderRadius: '24px', border: 'none', padding: '15px 20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ fontWeight: '900', fontSize: '14px' }}
                                    labelStyle={{ color: '#64748b', marginBottom: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="users" name="New Users" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#userCurve)" activeDot={{ r: 8, strokeWidth: 0, fill: '#6366f1' }} animationDuration={3000} />
                                <Area type="monotone" dataKey="properties" name="New Assets" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#propCurve)" activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }} animationDuration={3000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Asset Portfolio Distribution */}
                <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden">
                    <div className="mb-16 space-y-2 relative z-10">
                        <h2 className="text-3xl font-black text-[var(--color-secondary)] flex items-center gap-4">
                            Portfolio Logic
                        </h2>
                    </div>

                    <div className="h-[350px] w-full relative z-10 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={propertyDistribution.length > 0 ? propertyDistribution : [{ name: 'N/A', value: 1 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={90}
                                    outerRadius={130}
                                    paddingAngle={12}
                                    dataKey="value"
                                    animationBegin={500}
                                    animationDuration={2000}
                                    stroke="none"
                                >
                                    {propertyDistribution.map((e, i) => (
                                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} className="hover:opacity-80 transition-all cursor-pointer shadow-2xl" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', borderRadius: '24px', border: 'none', padding: '12px 20px', color: '#fff' }}
                                    itemStyle={{ fontWeight: '900', fontSize: '13px' }}
                                />
                                <Legend verticalAlign="bottom" height={40} iconType="circle" formatter={(v) => <span className="text-[10px] font-black uppercase text-[var(--text-muted)] ml-3 tracking-widest">{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Summary Insight in center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-6 text-center">
                            <p className="text-4xl font-black text-[var(--color-secondary)] leading-none">{stats?.totalProperties || 0}</p>
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-2">Active Units</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Verification Queue (Critical Action) */}
            <section className="bg-white rounded-[4rem] border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
                <div className="p-12 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-8 bg-gray-50/20">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[var(--color-secondary)] flex items-center gap-4">
                            Verification Terminal <Clock size={32} className="text-amber-500 animate-pulse" />
                        </h2>
                        <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40 italic">Inbound registration approval pipeline</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="secondary" size="md">Audit Full Queue</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-['Inter']">
                        <thead>
                            <tr className="bg-gray-50/50 text-[var(--text-muted)] text-[10px] uppercase font-black tracking-[0.3em] border-b border-gray-50">
                                <th className="px-12 py-6">Entity (Owner)</th>
                                <th className="px-12 py-6">Identity (Email)</th>
                                <th className="px-12 py-6 text-center">Protocol Date</th>
                                <th className="px-12 py-6 text-center">Asset Class</th>
                                <th className="px-12 py-6 text-right">Operational Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {recentOwners.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-12 py-32 text-center opacity-20 italic font-black uppercase tracking-widest text-lg">Clear Approval Manifest</td>
                                </tr>
                            ) : (
                                recentOwners.map((owner) => (
                                    <tr key={owner._id} className="hover:bg-indigo-50/20 transition-all group border-l-4 border-l-transparent hover:border-l-indigo-500">
                                        <td className="px-12 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-sm font-black shadow-xl group-hover:-rotate-12 transition-transform">
                                                    {owner.user?.name?.[0]}
                                                </div>
                                                <span className="text-base font-black text-[var(--color-secondary)] uppercase tracking-tight">{owner.user?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-8 text-sm text-[var(--text-muted)] font-bold italic opacity-60 group-hover:opacity-100 transition-opacity underline decoration-indigo-100 underline-offset-4">{owner.user?.email}</td>
                                        <td className="px-12 py-8 text-center text-[11px] font-black text-[var(--color-secondary)] uppercase tracking-widest">
                                            {new Date(owner.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-12 py-8 text-center">
                                            <span className="inline-flex px-5 py-2 bg-indigo-50/50 text-indigo-700 text-[10px] font-black px-4 py-1.5 rounded-xl border border-indigo-100 uppercase tracking-widest shadow-sm">
                                                {owner.ownerType}
                                            </span>
                                        </td>
                                        <td className="px-12 py-8 text-right">
                                            <Button
                                                onClick={() => handleApproveOwner(owner._id)}
                                                variant="primary"
                                                size="sm"
                                            >
                                                AUTHORIZE ACCESS
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-10 bg-gray-50/30 border-t border-gray-50 flex items-center justify-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--text-muted)] opacity-20 animate-pulse">Platform Management Data Stream Finalized</p>
                </div>
            </section>

            {/* Custom Aesthetic Effects */}
            <style>{`
               .animate-in {
                  animation: slide-up 1.5s cubic-bezier(0.16, 1, 0.3, 1);
               }
               @keyframes slide-up {
                  from { opacity: 0; transform: translateY(40px); }
                  to { opacity: 1; transform: translateY(0); }
               }
               .recharts-cartesian-grid-vertical line {
                  display: none;
               }
               .recharts-cartesian-grid-horizontal line {
                  stroke: #f1f5f9;
                  stroke-width: 1px;
               }
               ::-webkit-scrollbar { width: 8px; }
               ::-webkit-scrollbar-track { background: transparent; }
               ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; border: 2px solid white; }
               ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div>
    );
}
