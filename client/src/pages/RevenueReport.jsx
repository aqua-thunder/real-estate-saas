import React from "react";
import {
    IndianRupee,
    Calendar,
    Home,
    BarChart3,
    Receipt,
    Wrench,
    TrendingUp,
    Download,
    ChevronDown,
    MoreVertical,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { useAuth } from "../store/auth";
import Button from "../components/ui/Button";

const RevenueReport = () => {
    const { token } = useAuth();
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("http://localhost:7000/api/owner/revenue-stats", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                }
            } catch (error) {
                console.error("Error fetching revenue stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            </div>
        );
    }

    const { stats, transactions, efficiency, breakdown } = data || {
        stats: { totalRevenue: "₹0", monthlyRevenue: "₹0", occupancyRate: "0%", pendingRent: "₹0", netProfit: "₹0" },
        transactions: [],
        efficiency: 0,
        breakdown: {
            rent: { collected: "₹0", pending: "₹0", lateFees: "₹0" },
            other: { parking: "₹0", utilities: "₹0", services: "₹0" },
            expenses: { maintenance: "₹0", repairs: "₹0", utilities: "₹0" }
        }
    };

    const statsConfig = [
        { title: "Total Revenue", value: stats.totalRevenue, change: "+0%", trending: "up", icon: IndianRupee, color: "bg-blue-50 text-blue-600" },
        { title: "Monthly Revenue", value: stats.monthlyRevenue, change: "+0%", trending: "up", icon: Calendar, color: "bg-indigo-50 text-indigo-600" },
        { title: "Occupancy Rate", value: stats.occupancyRate, change: "+0%", trending: "up", icon: BarChart3, color: "bg-emerald-50 text-emerald-600" },
        { title: "Pending Rent", value: stats.pendingRent, change: "+0%", trending: "down", icon: Receipt, color: "bg-rose-50 text-rose-600" },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-secondary)] p-4 sm:p-6 lg:p-0 space-y-5 selection:bg-[var(--color-primary)]/30 font-['Inter']">

            {/* --- HEADER --- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <h1 className="font-black text-[var(--color-secondary)] tracking-tight">
                        Revenue Report
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="secondary" size="md" icon={<Download size={18} />}>
                        Export Report
                    </Button>
                </div>
            </header>

            {/* --- MAIN KPI GRID --- */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsConfig.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </section>

            {/* --- CORE INSIGHTS --- */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left: Net Profit Hero & Breakdowns */}
                <div className="xl:col-span-2 space-y-8">

                    {/* Net Profit Card */}
                    <div className="relative group overflow-hidden bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[var(--color-primary)]/5 blur-[100px] rounded-full group-hover:bg-[var(--color-primary)]/10 transition-all duration-700"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <span className="text-sm font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 text-xl">Total Net Profit</span>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-black text-[var(--color-secondary)] tracking-tighter">{stats.netProfit}</span>
                                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-black italic">
                                        <TrendingUp size={14} /> ACTIVE GROWTH
                                    </div>
                                </div>
                                <p className="text-[var(--text-muted)] mt-6 text-sm max-w-md font-medium leading-relaxed">Your net profit is calculated after maintenance and expenses. Keep track of your overheads for better efficiency.</p>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="64" cy="64" r="58" fill="transparent" stroke="#f8fafc" strokeWidth="8" />
                                        <circle cx="64" cy="64" r="58" fill="transparent" stroke="url(#revenueGrad)" strokeWidth="8" strokeDasharray="364" strokeDashoffset={364 * (1 - (efficiency || 0) / 100)} strokeLinecap="round" />
                                        <defs>
                                            <linearGradient id="revenueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="var(--color-primary)" />
                                                <stop offset="100%" stopColor="#ff7675" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-[var(--color-secondary)] leading-none">{efficiency}%</span>
                                        <span className="text-[9px] uppercase font-black text-[var(--text-muted)] mt-1 tracking-widest text-center">Occupancy</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SummaryCard
                            title="Rent Income"
                            icon={Receipt}
                            items={[
                                { label: "Collected", value: breakdown.rent.collected, color: "text-emerald-600" },
                                { label: "Pending", value: breakdown.rent.pending, color: "text-rose-600" },
                                { label: "Late Fees", value: breakdown.rent.lateFees }
                            ]}
                        />
                        <SummaryCard
                            title="Other Income"
                            icon={IndianRupee}
                            items={[
                                { label: "Parking", value: breakdown.other.parking },
                                { label: "Utilities", value: breakdown.other.utilities },
                                { label: "Services", value: breakdown.other.services }
                            ]}
                        />
                        <SummaryCard
                            title="Expenses"
                            icon={Wrench}
                            items={[
                                { label: "Property Maint.", value: breakdown.expenses.maintenance },
                                { label: "Repairs", value: breakdown.expenses.repairs, color: "text-amber-600" },
                                { label: "Utilities", value: breakdown.expenses.utilities }
                            ]}
                        />
                    </div>
                </div>

                {/* Right: Charts Sidecar */}
                <div className="space-y-6">
                    <MiniChartSection title="Revenue Pulse" />
                    <MiniChartSection title="Occupancy Mix" />

                </div>
            </div>

            {/* --- TRANSACTION TABLE --- */}
            <section className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)]">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full"></div>
                        <h3 className="text-xl font-black text-[var(--color-secondary)] tracking-tight">Transaction History</h3>
                    </div>
                    <Button variant="ghost" size="xs">See All</Button>
                </div>

                {/* Desktop/Tablet view */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] uppercase tracking-[0.2em] font-black text-[var(--text-muted)] bg-gray-50/50">
                            <tr>
                                <th className="px-10 py-5">Date</th>
                                <th className="px-10 py-5">Identity</th>
                                <th className="px-10 py-5">Unit</th>
                                <th className="px-10 py-5">Invoice</th>
                                <th className="px-10 py-5 text-right">Settlement</th>
                                <th className="px-10 py-5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((t, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors group cursor-default">
                                    <td className="px-10 py-8 whitespace-nowrap text-[13px] font-bold text-[var(--text-muted)]">{t.date}</td>
                                    <td className="px-10 py-8 whitespace-nowrap">
                                        <div className="font-black text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors">{t.tenant}</div>
                                    </td>
                                    <td className="px-10 py-8 whitespace-nowrap text-xs font-black text-[var(--text-muted)] tracking-widest uppercase opacity-60">{t.unit}</td>
                                    <td className="px-10 py-8 whitespace-nowrap">
                                        <span className="text-[10px] font-black text-[var(--text-muted)] bg-gray-100 px-2 py-1 rounded lowercase">{t.invoice}</span>
                                    </td>
                                    <td className="px-10 py-8 whitespace-nowrap text-right font-black text-[var(--color-secondary)] text-lg">{t.amount}</td>
                                    <td className="px-10 py-8 whitespace-nowrap text-center">
                                        <StatusPill status={t.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile view */}
                <div className="md:hidden p-4 space-y-4">
                    {transactions.map((t, i) => (
                        <div key={i} className="p-6 space-y-4 bg-gray-50/50 border border-gray-100 rounded-3xl hover:bg-white transition-all shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-lg font-black text-[var(--color-secondary)] shadow-sm">
                                        {t.tenant[0]}
                                    </div>
                                    <div>
                                        <div className="font-black text-[var(--color-secondary)] text-lg">{t.tenant}</div>
                                        <div className="text-[11px] font-bold text-[var(--text-muted)] mt-1">{t.date} • Unit {t.unit}</div>
                                    </div>
                                </div>
                                <StatusPill status={t.status} />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <div className="text-[10px] font-black text-[var(--text-muted)] bg-gray-100 px-2 py-1 rounded">{t.invoice}</div>
                                <div className="font-black text-xl text-[var(--color-secondary)]">{t.amount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

/* --- ENHANCED HELPER COMPONENTS --- */

const StatCard = ({ title, value, change, trending, icon: Icon, color }) => (
    <div className="premium-card rounded-[2.5rem] p-1.5 ">
        <div className="bg-white p-6 rounded-[2.2rem]">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={22} />
            </div>
            <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
            <h3 className="text-2xl font-black text-[var(--color-secondary)] tracking-tight">{value}</h3>
            <div className={`mt-3 flex items-center gap-1.5 text-xs font-black ${trending === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                <div className={`p-1 rounded-full ${trending === "up" ? "bg-emerald-50" : "bg-rose-50"}`}>
                    {trending === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
                {change}
                <span className="text-[var(--text-muted)] opacity-40 italic ml-1 font-bold">vs last month</span>
            </div>
        </div>
    </div>
);

const SummaryCard = ({ title, items, icon: Icon }) => (
    <div className="bg-white border border-gray-50 p-8 rounded-[2rem] group hover:border-[var(--color-primary)]/20 transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gray-50 rounded-2xl text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                <Icon size={20} />
            </div>
            <h3 className="font-black text-[var(--color-secondary)] text-lg tracking-tight uppercase text-xs tracking-widest">{title}</h3>
        </div>
        <div className="space-y-6">
            {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-end group/item">
                    <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest opacity-60 group-hover/item:opacity-100 transition-opacity">
                        {item.label}
                    </span>
                    <span className={`font-black tracking-tight ${item.color || "text-[var(--color-secondary)]"}`}>
                        {item.value}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const StatusPill = ({ status }) => {
    const isPaid = status === "Paid";
    return (
        <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-[10px] uppercase font-black tracking-[0.1em] border ${isPaid
            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
            : "bg-amber-50 text-amber-600 border-amber-100"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-600" : "bg-amber-600"}`}></span>
            {status}
        </span>
    );
};

const MiniChartSection = ({ title }) => (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 h-48 flex flex-col group overflow-hidden shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 group-hover:opacity-100 transition-opacity">{title}</h3>
            <MoreVertical size={14} className="text-[var(--text-muted)] opacity-30" />
        </div>
        <div className="flex-1 flex items-end justify-between gap-1.5 px-2 pb-2 border-b border-gray-50">
            {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 w-full bg-gray-100 rounded-t-lg group-hover:bg-[var(--color-primary)] group-hover:shadow-[0_0_15px_rgba(231,76,60,0.2)] transition-all duration-500"
                />
            ))}
        </div>
    </div>
);

export default RevenueReport;
