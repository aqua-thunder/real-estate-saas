import { useState, useMemo } from "react";
import React from "react";
import {
    Users,
    Home,
    Calendar,
    CreditCard,
    Search,
    Plus,
    MoreVertical,
    Download,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    X,
    FileText,
    Mail,
    Phone,
    MapPin
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Tenant = () => {
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [isAddingTenant, setIsAddingTenant] = useState(false);

    const tenants = useMemo(() => [
        {
            id: 1,
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            phone: "+91 98765 43210",
            property: "Skyline Heights",
            unit: "A-101",
            floor: "1st Floor",
            leaseStart: "01 Jan 2025",
            leaseEnd: "31 Dec 2025",
            rent: 25000,
            deposit: 50000,
            leaseStatus: "Active",
            paymentStatus: "Paid",
            manager: "Amit Patel",
            totalCollected: 150000,
            pending: 0,
            maintenanceCost: 5000,
            lateFees: 0,
            maintenanceRequests: 3,
            openRequests: 1,
            avatar: "RS"
        },
        {
            id: 2,
            name: "Priya Gupta",
            email: "priya.g@example.com",
            phone: "+91 91234 56789",
            property: "Green Valley",
            unit: "B-204",
            floor: "2nd Floor",
            leaseStart: "15 Mar 2024",
            leaseEnd: "14 Mar 2025",
            rent: 18500,
            deposit: 37000,
            leaseStatus: "Expiring",
            paymentStatus: "Pending",
            manager: "Neha Singh",
            totalCollected: 185000,
            pending: 18500,
            maintenanceCost: 2000,
            lateFees: 500,
            maintenanceRequests: 1,
            openRequests: 0,
            avatar: "PG"
        },
        {
            id: 3,
            name: "Vikram Malhotra",
            email: "vikram.m@example.com",
            phone: "+91 99887 76655",
            property: "Skyline Heights",
            unit: "C-502",
            floor: "5th Floor",
            leaseStart: "01 Jun 2024",
            leaseEnd: "31 May 2025",
            rent: 32000,
            deposit: 64000,
            leaseStatus: "Active",
            paymentStatus: "Overdue",
            manager: "Amit Patel",
            totalCollected: 128000,
            pending: 64000,
            maintenanceCost: 0,
            lateFees: 1200,
            maintenanceRequests: 5,
            openRequests: 2,
            avatar: "VM"
        },
        {
            id: 4,
            name: "Sanya Roy",
            email: "sanya.roy@example.com",
            phone: "+1 234 567 890",
            property: "Ocean Breeze",
            unit: "12-F",
            floor: "12th Floor",
            leaseStart: "20 Sep 2024",
            leaseEnd: "19 Sep 2025",
            rent: 45000,
            deposit: 90000,
            leaseStatus: "Active",
            paymentStatus: "Paid",
            manager: "Suresh Rao",
            totalCollected: 225000,
            pending: 0,
            maintenanceCost: 8500,
            lateFees: 0,
            maintenanceRequests: 2,
            openRequests: 0,
            avatar: "SR"
        }
    ], []);

    const summary = {
        totalTenants: { value: 42, color: "text-blue-400", icon: Users, trend: "+4%" },
        activeLeases: { value: 38, color: "text-emerald-400", icon: CheckCircle2, trend: "+2%" },
        vacantUnits: { value: 5, color: "text-amber-400", icon: Home, trend: "-1%" },
        expiringCount: { value: 3, color: "text-rose-400", icon: AlertCircle, trend: "Static" },
        overduePayments: { value: 2, color: "text-red-500", icon: CreditCard, trend: "+12%" },
        occupancyRate: { value: "89%", color: "text-purple-400", icon: TrendingUp, trend: "+1.5%" },
    };

    const filteredTenants = tenants.filter(tenant => {
        const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tenant.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tenant.unit.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || tenant.paymentStatus === filterStatus || tenant.leaseStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Paid": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "Pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case "Overdue": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            case "Active": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "Expiring": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-secondary)] p-4 sm:p-6 lg:p-8 font-[var(--font-body)] relative">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-[var(--font-heading)] text-white tracking-tight">
                        Tenant Management
                    </h1>
                    <p className="text-[var(--text-card)] mt-1">Manage your residents, leases, and financial records in one place.</p>
                </div>
                <div className="grid grid-cols-2 md:flex items-center gap-3">
                    <Button type="secondary" onClick={() => { }} className="mt-0! px-4! py-2! w-full md:w-auto">
                        <Download size={18} /> Export
                    </Button>
                    <Button type="primary" onClick={() => setIsAddingTenant(true)} className="mt-0! px-4! py-2! w-full md:w-auto">
                        <Plus size={18} /> Add Tenant
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
                {Object.entries(summary).map(([key, data]) => {
                    const Icon = data.icon;
                    return (
                        <div key={key} className="bg-[var(--bg-card)] rounded-2xl p-5 border border-white/5 shadow-xl transition-all hover:border-[var(--color-primary)]/30 group">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-2 rounded-xl bg-white/5 ${data.color} group-hover:scale-110 transition-transform`}>
                                    <Icon size={20} />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${data.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                                    {data.trend}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{data.value}</h3>
                            <p className="text-[var(--text-card)] text-xs font-medium uppercase tracking-wider">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Filters and Search */}
            <div className="bg-[var(--bg-card)] rounded-2xl p-4 mb-6 border border-white/5 shadow-lg flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-card)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, property, or unit..."
                        className="w-full bg-[var(--bg-main)]/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {["All", "Paid", "Pending", "Overdue", "Expiring"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${filterStatus === status
                                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                : "bg-white/5 text-[var(--text-card)] border-white/5 hover:border-white/10"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                    <div className="h-10 w-px bg-white/10 mx-1 hidden md:block"></div>
                    <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[var(--text-card)] focus:outline-none">
                        <option>All Properties</option>
                        <option>Skyline Heights</option>
                        <option>Green Valley</option>
                    </select>
                </div>
            </div>

            {/* Table/Card View Section */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
                {/* Desktop Table View (Hidden on Mobile/Tablet) */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[var(--text-card)] text-xs uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">Tenant</th>
                                <th className="px-6 py-4">Property & Unit</th>
                                <th className="px-6 py-4">Lease Period</th>
                                <th className="px-6 py-4">Financials</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTenants.length > 0 ? (
                                filteredTenants.map((tenant) => (
                                    <tr
                                        key={tenant.id}
                                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                        onClick={() => setSelectedTenant(tenant)}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                    {tenant.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold text-sm">{tenant.name}</p>
                                                    <p className="text-[var(--text-card)] text-xs">{tenant.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-white text-sm font-medium">{tenant.property}</p>
                                            <div className="flex items-center gap-1.5 text-[var(--text-card)] text-xs mt-0.5">
                                                <Home size={12} />
                                                <span>Unit {tenant.unit} • {tenant.floor}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm">
                                            <div className="flex items-center gap-1 text-white">
                                                <Calendar size={14} className="text-[var(--color-primary)]" />
                                                <span>Ends {tenant.leaseEnd}</span>
                                            </div>
                                            <p className="text-[var(--text-card)] text-xs mt-1">Started {tenant.leaseStart}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-white font-bold text-sm">₹{tenant.rent.toLocaleString()}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${tenant.pending > 0 ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                                                    {tenant.pending > 0 ? `₹${tenant.pending.toLocaleString()} Due` : 'All Paid'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(tenant.paymentStatus)}`}>
                                                {tenant.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-[var(--text-card)] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                                                    <Mail size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-[var(--text-card)] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Users size={48} className="text-white/10" />
                                            <p className="text-[var(--text-card)]">No tenants found matching your criteria.</p>
                                            <Button type="outline" onClick={() => { setSearchQuery(""); setFilterStatus("All") }} className="mt-2! py-2!">
                                                Clear Filters
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile/Tablet Card View (Hidden on Desktop) */}
                <div className="lg:hidden divide-y divide-white/5">
                    {filteredTenants.length > 0 ? (
                        filteredTenants.map((tenant) => (
                            <div
                                key={tenant.id}
                                className="p-4 hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors cursor-pointer"
                                onClick={() => setSelectedTenant(tenant)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                            {tenant.avatar}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-sm">{tenant.name}</h4>
                                            <p className="text-[var(--text-card)] text-xs">{tenant.property} • {tenant.unit}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStatusColor(tenant.paymentStatus)}`}>
                                        {tenant.paymentStatus}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="space-y-1">
                                        <p className="text-[var(--text-card)] uppercase tracking-wider font-bold text-[9px]">Lease End</p>
                                        <div className="flex items-center gap-1.5 text-white">
                                            <Calendar size={12} className="text-[var(--color-primary)]" />
                                            <span>{tenant.leaseEnd}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[var(--text-card)] uppercase tracking-wider font-bold text-[9px]">Monthly Rent</p>
                                        <p className="text-white font-bold">₹{tenant.rent.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${tenant.pending > 0 ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                                        {tenant.pending > 0 ? `₹${tenant.pending.toLocaleString()} Due` : 'Payment Clear'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-[var(--text-card)]" onClick={(e) => e.stopPropagation()}>
                                            <Mail size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-[var(--text-card)]" onClick={(e) => e.stopPropagation()}>
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center">
                            <Users size={40} className="mx-auto text-white/10 mb-3" />
                            <p className="text-[var(--text-card)] text-sm">No results found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Tenant Detail Drawer */}
            {selectedTenant && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTenant(null)}></div>
                    <div className="relative w-full sm:max-w-md lg:max-w-lg bg-[var(--bg-card)] h-full overflow-y-auto shadow-2xl border-l border-white/10 animate-slide-in">
                        <div className="sticky top-0 z-10 bg-[var(--bg-card)] border-b border-white/5 p-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Tenant Details</h2>
                            <button
                                onClick={() => setSelectedTenant(null)}
                                className="p-2 hover:bg-white/5 rounded-full text-[var(--text-card)] hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Profile Header */}
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl mb-4 border-4 border-white/5">
                                    {selectedTenant.avatar}
                                </div>
                                <h3 className="text-2xl font-bold text-white">{selectedTenant.name}</h3>
                                <div className="flex flex-col gap-1 mt-1">
                                    <p className="text-[var(--text-card)] flex items-center justify-center gap-2">
                                        <Mail size={14} /> {selectedTenant.email}
                                    </p>
                                    <p className="text-[var(--text-card)] flex items-center justify-center gap-2">
                                        <Phone size={14} /> {selectedTenant.phone}
                                    </p>
                                </div>
                                <p className="text-[var(--text-card)] flex items-center justify-center gap-2 mt-3">
                                    <span className={`w-2 h-2 rounded-full ${selectedTenant.leaseStatus === 'Active' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                                    {selectedTenant.leaseStatus} Lease
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <Button type="secondary" className="mt-0! w-full py-2.5! rounded-2xl!">
                                    <Mail size={16} className="mr-2" /> Message
                                </Button>
                                <Button type="outline" className="mt-0! w-full py-2.5! rounded-2xl!">
                                    <Phone size={16} className="mr-2" /> Call
                                </Button>
                            </div>

                            {/* Info Sections */}
                            <div className="space-y-8">
                                <section>
                                    <h4 className="text-[var(--text-card)] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Home size={14} /> Property Details
                                    </h4>
                                    <div className="bg-white/5 rounded-2xl p-4 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[var(--text-card)]">Property</span>
                                            <span className="text-sm font-medium text-white">{selectedTenant.property}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[var(--text-card)]">Unit / Floor</span>
                                            <span className="text-sm font-medium text-white">{selectedTenant.unit} / {selectedTenant.floor}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[var(--text-card)]">Property Manager</span>
                                            <span className="text-sm font-medium text-white">{selectedTenant.manager}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                            <span className="text-sm text-[var(--text-card)]">Rent Amount</span>
                                            <span className="text-base font-bold text-[var(--color-primary)]">₹{selectedTenant.rent.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-[var(--text-card)] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <CreditCard size={14} /> Financial Status
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/5 rounded-2xl p-4">
                                            <p className="text-[var(--text-card)] text-[10px] uppercase mb-1">Total Collected</p>
                                            <p className="text-lg font-bold text-white">₹{selectedTenant.totalCollected.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4">
                                            <p className="text-[var(--text-card)] text-[10px] uppercase mb-1">Balance Due</p>
                                            <p className={`text-lg font-bold ${selectedTenant.pending > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>₹{selectedTenant.pending.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4">
                                            <p className="text-[var(--text-card)] text-[10px] uppercase mb-1">Security Deposit</p>
                                            <p className="text-lg font-bold text-white">₹{selectedTenant.deposit.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4">
                                            <p className="text-[var(--text-card)] text-[10px] uppercase mb-1">Payment Status</p>
                                            <p className={`text-sm font-bold ${selectedTenant.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-rose-400'}`}>{selectedTenant.paymentStatus}</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-[var(--text-card)] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <FileText size={14} /> Lease Documents
                                    </h4>
                                    <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/[0.08] transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Lease_Agreement_2025.pdf</p>
                                                <p className="text-[10px] text-[var(--text-card)]">Signed on 24 Dec 2024</p>
                                            </div>
                                        </div>
                                        <Download size={16} className="text-[var(--text-card)] group-hover:text-white" />
                                    </div>
                                </section>
                            </div>

                            <div className="mt-12 mb-8">
                                <Button type="primary" className="w-full! rounded-2xl! py-4! font-bold text-base">
                                    Edit Tenant Profile
                                </Button>
                                <p className="text-center text-xs text-[var(--text-card)] mt-4">Last update: 2 hours ago by System</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Add Tenant - Simulation */}
            {isAddingTenant && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddingTenant(false)}></div>
                    <div className="relative w-full max-w-2xl bg-[var(--bg-card)] md:rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-zoom-in h-full md:h-auto overflow-y-auto">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Add New Tenant</h2>
                            <button onClick={() => setIsAddingTenant(false)} className="p-2 hover:bg-white/5 rounded-full text-[var(--text-card)] transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-8">
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddingTenant(false); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Full Name" placeholder="e.g. Rahul Sharma" required />
                                    <Input label="Email Address" type="email" placeholder="rahul@example.com" required />
                                    <Input label="Phone Number" placeholder="+91 XXXXX XXXXX" required />
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-[var(--text-secondary)]">Property Selection</label>
                                        <select className="w-full bg-[var(--bg-main)] border border-gray-600 focus:border-[var(--color-primary)] text-[var(--text-secondary)] rounded-xl px-4 py-3 outline-none">
                                            <option>Select Property</option>
                                            <option>Skyline Heights</option>
                                            <option>Ocean Breeze</option>
                                        </select>
                                    </div>
                                    <Input label="Unit Number" placeholder="e.g. A-101" required />
                                    <Input label="Monthly Rent" type="number" placeholder="Enter amount" required />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button type="secondary" onClick={() => setIsAddingTenant(false)} className="flex-1! mt-0!">
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit" className="flex-1! mt-0!">
                                        Save Tenant
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes zoom-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-slide-in {
                    animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .animate-zoom-in {
                    animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    );
};

export default Tenant;
