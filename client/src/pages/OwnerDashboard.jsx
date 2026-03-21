import React, { useState, useEffect } from "react";
import { Building2, Home, Key, DoorClosed, IndianRupee, Wrench, AlertCircle, Loader2, Calendar, TrendingUp, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Activity, Users, FileText, Settings, Heart } from "lucide-react";
import { useAuth } from "../store/auth";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import Button from "../components/ui/Button";

const OwnerDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/owner/dashboard-stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] animate-pulse">Synchronizing Portfolio Intel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6">
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-10 rounded-[3rem] flex flex-col items-center gap-6 w-full max-w-xl text-center shadow-2xl shadow-rose-100">
          <div className="p-5 bg-white rounded-3xl shadow-sm"><AlertCircle size={40} className="animate-bounce" /></div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-rose-700 uppercase tracking-tight">System Interrupt</h3>
            <p className="font-bold text-sm opacity-80">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="danger" size="md">Retry Synchronization</Button>
        </div>
      </div>
    );
  }

  const PIE_COLORS = {
    Occupied: "#10b981", // Emerald 500
    Vacant: "#f59e0b",   // Amber 500
    Other: "#64748b"     // Slate 500
  };

  const occupancyData = stats?.occupancyChart?.filter(entry => entry.value > 0) || [];

  const kpis = [
    { label: "Assets", val: stats?.totalProperties || 0, icon: Building2, color: "indigo", trend: "+2.4%" },
    { label: "Inventory", val: stats?.totalUnits || 0, icon: Home, color: "blue", trend: "+1.2%" },
    { label: "Live", val: stats?.occupiedUnits || 0, icon: DoorClosed, color: "emerald", trend: "+4.1%" },
    { label: "Leads", val: stats?.vacantUnits || 0, icon: Key, color: "amber", trend: "-0.8%" },
    { label: "Yield", val: `₹${(stats?.monthlyRentalIncome || 0).toLocaleString()}`, icon: IndianRupee, color: "violet", trend: "+12.5%" },
    { label: "Alerts", val: stats?.pendingMaintenanceApprovals || 0, icon: Wrench, color: "rose", trend: "Critical" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-4 sm:p-6 lg:p-2 space-y-2 font-['Inter']">

      {/* Header Intel */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-4">
        <div className="space-y-2">
          <h1 className=" font-black text-[var(--color-secondary)] tracking-tight">Owner Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] bg-white px-6 py-3.5 rounded-2xl border border-gray-100 text-[var(--text-muted)] shadow-sm group hover:border-indigo-100 transition-all">
            <Calendar size={14} className="text-indigo-500 group-hover:scale-110 transition-transform" />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </header>

      {/* KPI Matrix */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.03)] group transition-all duration-500 hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl bg-${kpi.color}-50 text-${kpi.color}-600 shadow-sm border border-${kpi.color}-100 transition-all duration-700 group-hover:bg-${kpi.color}-600 group-hover:text-white`}>
                <kpi.icon size={20} />
              </div>

            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-1.5 opacity-50">{kpi.label}</p>
              <h3 className="text-2xl font-black text-[var(--color-secondary)] tracking-tight truncate">{kpi.val}</h3>
            </div>
            {/* Subtle bg glow */}
            <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-${kpi.color}-50 scale-0 group-hover:scale-150 transition-transform duration-1000 opacity-40`} />
          </div>
        ))}
      </section>

      {/* Analytics Main View */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Yield Curve - Area Chart */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] lg:col-span-2 relative overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[var(--color-secondary)] flex items-center gap-3">
                Yield Vector <TrendingUp className="text-emerald-500" size={24} />
              </h2>
              <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Financial velocity over last 6 months</p>
            </div>
            <div className="flex gap-2">
              {['6M', '1Y', 'ALL'].map(t => (
                <Button
                  key={t}
                  onClick={() => { }}
                  variant={t === '6M' ? 'primary' : 'secondary'}
                  size="xs"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full mt-auto relative z-10">
            {stats?.incomeChart?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.incomeChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="yieldGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={false}
                    dy={20}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111', borderRadius: '24px', border: 'none', padding: '15px 20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#10b981', fontWeight: '900', fontSize: '14px' }}
                    labelStyle={{ color: '#64748b', marginBottom: '8px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}
                    cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' }}
                    formatter={(v) => [`₹${v.toLocaleString()}`, "YIELD"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={5}
                    fill="url(#yieldGlow)"
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }}
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="p-5 bg-gray-50 rounded-full text-gray-300"><Activity size={40} /></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50">Insufficient yield data for projection</p>
              </div>
            )}
          </div>
        </div>

        {/* Occupancy Logic - Donut Chart */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden">
          <div className="mb-12 space-y-1 relative z-10">
            <h2 className="text-2xl font-black text-[var(--color-secondary)] flex items-center gap-3">
              Asset Status <PieChartIcon className="text-indigo-500" size={24} />
            </h2>
            <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Portfolio occupancy distribution</p>
          </div>

          <div className="h-[300px] w-full relative z-10">
            {occupancyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    animationBegin={500}
                    animationDuration={1500}
                  >
                    {occupancyData.map((e, i) => (
                      <Cell key={`cell-${i}`} fill={PIE_COLORS[e.name]} className="hover:opacity-80 transition-all cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111', borderRadius: '20px', border: 'none', padding: '10px 15px', color: '#fff' }}
                    itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(v) => <span className="text-[10px] font-black uppercase text-[var(--text-muted)] ml-2">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="p-5 bg-gray-50 rounded-full text-gray-300"><PieChartIcon size={40} /></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50">Empty inventory manifest</p>
              </div>
            )}

            {/* Center Text for Donut */}
            {occupancyData.length > 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 text-center">
                <p className="text-3xl font-black text-[var(--color-secondary)] leading-none">{Math.round((stats.occupiedUnits / stats.totalUnits) * 100) || 0}%</p>
                <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">Live</p>
              </div>
            )}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 relative z-10 pt-8 border-t border-gray-50">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <p className="text-[8px] font-black text-emerald-800 uppercase tracking-widest leading-none">Market Share</p>
              <p className="text-lg font-black text-emerald-600 mt-2 tracking-tight">Prime</p>
            </div>
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
              <p className="text-[8px] font-black text-indigo-800 uppercase tracking-widest leading-none">Visibility</p>
              <p className="text-lg font-black text-indigo-600 mt-2 tracking-tight">Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tertiary Insights & Action Feed */}
      <section className="grid grid-cols-1 xl:grid-cols-4 gap-8 pb-10">

        {/* Live Operations Feed */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm xl:col-span-1 space-y-6">
          <h3 className="text-xs font-black text-[var(--color-secondary)] uppercase tracking-[0.2em] flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" /> System Ops Feed
          </h3>
          <div className="space-y-4">
            {[
              { action: "Rent Inflow", client: "Hub-01", time: "2m ago", color: "emerald", icon: IndianRupee },
              { action: "Lease Renew", client: "John Doe", time: "1h ago", color: "blue", icon: FileText },
              { action: "Unit Repair", client: "Unit A-12", time: "5h ago", color: "rose", icon: Wrench },
              { action: "New Lead", client: "Sarah K.", time: "Yesterday", color: "amber", icon: Users }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group cursor-help transition-all hover:translate-x-1">
                <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <item.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-[var(--color-secondary)] uppercase truncate">{item.action}</p>
                  <p className="text-[9px] text-[var(--text-muted)] font-bold truncate opacity-60 underline decoration-indigo-100">{item.client}</p>
                </div>
                <div className="text-[8px] font-black text-[var(--text-muted)] uppercase opacity-30 whitespace-nowrap">{item.time}</div>
              </div>
            ))}
          </div>
          <Button fullWidth variant="secondary" size="sm">Audit Manifest</Button>
        </div>

        {/* Maintenance Spotlight */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm xl:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
            <Wrench size={120} />
          </div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[var(--color-secondary)] uppercase tracking-tight">Maintenance Pipeline</h3>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Active critical protocols</p>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl text-rose-600 border border-rose-100 animate-pulse">
              <Activity size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 relative z-10">
            <div className="p-6 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
              <p className="text-3xl font-black text-rose-600 mb-1">{stats?.pendingMaintenanceApprovals || 0}</p>
              <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">Waitlist for Approval</p>
            </div>
            <div className="p-6 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Immediate Response</span>
              </div>
              <p className="text-[11px] font-bold text-[var(--text-muted)] leading-relaxed">System has flagged {stats?.pendingMaintenanceApprovals > 0 ? "critical items" : "zero items"} requiring owner signatures for resource deployment.</p>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between relative z-10">
            <Button variant="ghost" size="xs" onClick={() => { }} icon={<ArrowUpRight size={14} />}>
              Deployment Queue
            </Button>
            <Button variant="ghost" size="xs" className="opacity-50 italic" icon={<ShieldCheck className="text-emerald-500" size={14} />} disabled>
              Security Verified
            </Button>
          </div>
        </div>

        {/* Quick Links / Profile Status */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm xl:col-span-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-3xl font-black text-indigo-600 shadow-inner group cursor-pointer overflow-hidden transition-all duration-500 hover:rounded-full">
              {user?.name?.[0] || 'O'}
              <div className="absolute inset-0 bg-gray-900/0 hover:bg-gray-900/10 transition-colors" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-full border-4 border-white" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-black text-[var(--color-secondary)] uppercase tracking-tight">{user?.name}</p>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest underline decoration-2 underline-offset-4 decoration-indigo-200">Portfolio Owner</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button variant="secondary" size="md" iconOnly icon={<Settings size={18} />} className="w-full h-16" />
            <Button variant="secondary" size="md" iconOnly icon={<Heart size={18} />} className="w-full h-16 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100" />
          </div>
          <div className="pt-4 w-full">
            <div className="flex justify-between items-center text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 px-2">
              <span>Account Integrity</span>
              <span>98%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-[98%] h-full bg-gradient-to-r from-indigo-500 to-emerald-500" />
            </div>
          </div>
        </div>

      </section>

      {/* Global CSS for Charts & Scrollbars */}
      <style>{`
        .recharts-cartesian-grid-horizontal line, 
        .recharts-cartesian-grid-vertical line {
          stroke: #f1f5f9;
        }
        .recharts-tooltip-cursor {
          stroke: #10b981;
          stroke-width: 2px;
          stroke-dasharray: 5 5;
        }
        .animate-in {
          animation: fade-in 1s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
};

function ShieldCheck({ size = 20, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default OwnerDashboard;
