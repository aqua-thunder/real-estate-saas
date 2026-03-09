import React, { useState } from "react";
import {
    FileText,
    Plus,
    Search,
    Download,
    Eye,
    CreditCard,
    CheckCircle2,
    Clock,
    AlertCircle,
    X,
    Receipt,
    ChevronDown,
    Calendar,
    Home,
    User,
    Banknote,
    Zap,
    Wrench,
    Tag,
} from "lucide-react";
import Button from "../components/ui/button";

const Invoice = () => {

    const role = "manager"; // change to "tenant"

    const [showCreate, setShowCreate] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const invoices = [
        {
            id: "INV-001",
            tenant: "John",
            unit: "A-203",
            month: "Mar 2026",
            rent: 15000,
            utility: 800,
            maintenance: 1000,
            lateFee: 0,
            dueDate: "10 Mar 2026",
            status: "Unpaid"
        },
        {
            id: "INV-002",
            tenant: "Alex",
            unit: "B-102",
            month: "Feb 2026",
            rent: 15000,
            utility: 800,
            maintenance: 1000,
            lateFee: 200,
            dueDate: "10 Feb 2026",
            status: "Paid"
        }
    ];

    const paidCount = invoices.filter(i => i.status === "Paid").length;
    const unpaidCount = invoices.filter(i => i.status === "Unpaid").length;

    const summaryCards = [
        {
            label: "Total Invoices",
            value: invoices.length,
            icon: Receipt,
            color: "from-blue-500/20 to-blue-600/5",
            iconColor: "text-blue-400",
            borderColor: "border-blue-500/20",
        },
        {
            label: "Paid",
            value: paidCount,
            icon: CheckCircle2,
            color: "from-emerald-500/20 to-emerald-600/5",
            iconColor: "text-emerald-400",
            borderColor: "border-emerald-500/20",
        },
        {
            label: "Unpaid",
            value: unpaidCount,
            icon: Clock,
            color: "from-amber-500/20 to-amber-600/5",
            iconColor: "text-amber-400",
            borderColor: "border-amber-500/20",
        },
        {
            label: "Overdue",
            value: 0,
            icon: AlertCircle,
            color: "from-red-500/20 to-red-600/5",
            iconColor: "text-red-400",
            borderColor: "border-red-500/20",
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-main)] p-4 sm:p-6 lg:p-8">

            {/* ── HEADER ─────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
                        <FileText size={22} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <h1
                            className="text-2xl font-bold text-white"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Invoices
                        </h1>
                        <p className="text-xs text-[var(--text-card)] mt-0.5">
                            Manage and track all billing records
                        </p>
                    </div>
                </div>

                {role === "manager" && (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[#0091e6] text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.97] self-start sm:self-auto"
                    >
                        <Plus size={17} />
                        Create Invoice
                    </button>
                )}
            </div>

            {/* ── SUMMARY CARDS ──────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {summaryCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={i}
                            className={`relative overflow-hidden bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-2xl p-4 sm:p-5`}
                        >
                            {/* Glow blob */}
                            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20 blur-2xl bg-current" />
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-[var(--text-card)] font-medium mb-2">
                                        {card.label}
                                    </p>
                                    <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`p-2.5 rounded-xl bg-white/5 ${card.iconColor}`}>
                                    <Icon size={20} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── FILTERS ────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 sm:max-w-sm">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-card)]"
                    />
                    <input
                        placeholder="Search tenant or invoice…"
                        className="w-full bg-[var(--color-card)] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-secondary)] placeholder-[var(--text-card)] focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/30 transition-colors"
                    />
                </div>

                <div className="relative">
                    <select className="appearance-none bg-[var(--color-card)] border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/30 transition-colors cursor-pointer w-full sm:w-auto">
                        <option value="">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                    </select>
                    <ChevronDown
                        size={15}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-card)] pointer-events-none"
                    />
                </div>
            </div>

            {/* ── TABLE (desktop) / CARDS (mobile) ───────── */}

            {/* Desktop Table */}
            <div className="hidden md:block bg-[var(--color-card)] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                {["Invoice", "Tenant", "Unit", "Month", "Rent", "Utility", "Total", "Due Date", "Status", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-4 text-left text-xs font-semibold text-[var(--text-card)] uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {invoices.map((inv, index) => {
                                const total = inv.rent + inv.utility + inv.maintenance + inv.lateFee;
                                const isPaid = inv.status === "Paid";

                                return (
                                    <tr
                                        key={index}
                                        className="group hover:bg-white/[0.03] transition-colors duration-150"
                                    >
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-lg">
                                                {inv.id}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow">
                                                    {inv.tenant[0]}
                                                </div>
                                                <span className="text-sm font-medium text-white">
                                                    {inv.tenant}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[var(--text-card)]">
                                            {inv.unit}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                                            {inv.month}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                                            ₹{inv.rent.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[var(--text-card)]">
                                            ₹{inv.utility.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-bold text-white">
                                            ₹{total.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[var(--text-card)] whitespace-nowrap">
                                            {inv.dueDate}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isPaid
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-400" : "bg-amber-400"}`} />
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setSelectedInvoice(inv)}
                                                    title="View"
                                                    className="p-2 rounded-lg text-[var(--text-card)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-150"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    title="Download"
                                                    className="p-2 rounded-lg text-[var(--text-card)] hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-150"
                                                >
                                                    <Download size={16} />
                                                </button>
                                                {role === "tenant" && !isPaid && (
                                                    <button
                                                        title="Pay"
                                                        className="p-2 rounded-lg text-[var(--text-card)] hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-150"
                                                    >
                                                        <CreditCard size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Invoice Cards */}
            <div className="md:hidden flex flex-col gap-4">
                {invoices.map((inv, index) => {
                    const total = inv.rent + inv.utility + inv.maintenance + inv.lateFee;
                    const isPaid = inv.status === "Paid";

                    return (
                        <div
                            key={index}
                            className="bg-[var(--color-card)] border border-white/5 rounded-2xl p-4 shadow-lg"
                        >
                            {/* Card Top */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
                                        {inv.tenant[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{inv.tenant}</p>
                                        <p className="text-xs text-[var(--text-card)]">Unit {inv.unit}</p>
                                    </div>
                                </div>
                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isPaid
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-emerald-400" : "bg-amber-400"}`} />
                                    {inv.status}
                                </span>
                            </div>

                            {/* Card Info */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-mono text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded-lg">
                                    {inv.id}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs text-[var(--text-card)]">
                                    <Calendar size={13} />
                                    {inv.month}
                                </div>
                            </div>

                            <div className="h-px bg-white/5 mb-3" />

                            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                <div className="flex flex-col">
                                    <span className="text-xs text-[var(--text-card)]">Rent</span>
                                    <span className="font-medium text-white">₹{inv.rent.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-[var(--text-card)]">Utility</span>
                                    <span className="font-medium text-white">₹{inv.utility.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-[var(--text-card)]">Due Date</span>
                                    <span className="font-medium text-white">{inv.dueDate}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-[var(--text-card)]">Total</span>
                                    <span className="font-bold text-[var(--color-primary)]">₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedInvoice(inv)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-[var(--color-primary)]/10 text-[var(--text-card)] hover:text-[var(--color-primary)] transition-all text-xs font-medium border border-white/5 hover:border-[var(--color-primary)]/20"
                                >
                                    <Eye size={14} /> View
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-[var(--text-card)] hover:text-emerald-400 transition-all text-xs font-medium border border-white/5 hover:border-emerald-500/20">
                                    <Download size={14} /> Download
                                </button>
                                {role === "tenant" && !isPaid && (
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-violet-500/10 text-violet-400 transition-all text-xs font-medium border border-violet-500/20">
                                        <CreditCard size={14} /> Pay
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── CREATE INVOICE MODAL ───────────────────── */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-card)] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
                                    <Plus size={18} className="text-[var(--color-primary)]" />
                                </div>
                                <h2 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                                    Create Invoice
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowCreate(false)}
                                className="p-2 rounded-lg text-[var(--text-card)] hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {[
                                { placeholder: "Tenant Name", icon: User, type: "text" },
                                { placeholder: "Unit", icon: Home, type: "text" },
                                { placeholder: "Month (e.g. Mar 2026)", icon: Calendar, type: "text" },
                                { placeholder: "Rent (₹)", icon: Banknote, type: "number" },
                                { placeholder: "Maintenance (₹)", icon: Wrench, type: "number" },
                                { placeholder: "Utility Charges (₹)", icon: Zap, type: "number" },
                                { placeholder: "Late Fee (₹)", icon: Tag, type: "number" },
                            ].map(({ placeholder, icon: Icon, type }, i) => (
                                <div key={i} className="relative">
                                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-card)]" />
                                    <input
                                        type={type}
                                        placeholder={placeholder}
                                        className="w-full bg-[var(--bg-main)] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-secondary)] placeholder-[var(--text-card)] focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/30 transition-colors"
                                    />
                                </div>
                            ))}

                            {/* Due Date field */}
                            <div className="relative">
                                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-card)]" />
                                <input
                                    type="date"
                                    className="w-full bg-[var(--bg-main)] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-secondary)] placeholder-[var(--text-card)] focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/30 transition-colors"
                                />
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
                            <button
                                onClick={() => setShowCreate(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-card)] hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                            >
                                Cancel
                            </button>
                            <Button onClick={handleSubmit} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[#0091e6] transition-all shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.97]">
                                Save Invoice
                            </Button>
                        </div>

                    </div>
                </div>
            )}

            {/* ── INVOICE DETAILS MODAL ─────────────────── */}
            {selectedInvoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--color-card)] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
                                    <Receipt size={18} className="text-[var(--color-primary)]" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                                        Invoice Details
                                    </h2>
                                    <p className="text-xs text-[var(--text-card)] font-mono">{selectedInvoice.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="p-2 rounded-lg text-[var(--text-card)] hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Tenant Info */}
                        <div className="px-6 py-5">
                            <div className="flex items-center gap-3 mb-5 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                                    {selectedInvoice.tenant[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{selectedInvoice.tenant}</p>
                                    <p className="text-xs text-[var(--text-card)]">Unit {selectedInvoice.unit} · {selectedInvoice.month}</p>
                                </div>
                                <div className="ml-auto">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${selectedInvoice.status === "Paid"
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                            }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${selectedInvoice.status === "Paid" ? "bg-emerald-400" : "bg-amber-400"}`} />
                                        {selectedInvoice.status}
                                    </span>
                                </div>
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-2.5 mb-4">
                                {[
                                    { label: "Rent", value: selectedInvoice.rent, icon: Home },
                                    { label: "Utility", value: selectedInvoice.utility, icon: Zap },
                                    { label: "Maintenance", value: selectedInvoice.maintenance, icon: Wrench },
                                    { label: "Late Fee", value: selectedInvoice.lateFee, icon: Tag },
                                ].map(({ label, value, icon: Icon }) => (
                                    <div key={label} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-white/[0.03]">
                                        <div className="flex items-center gap-2.5 text-sm text-[var(--text-card)]">
                                            <Icon size={14} />
                                            {label}
                                        </div>
                                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                                            ₹{value.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between py-3 px-3.5 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-4">
                                <span className="text-sm font-semibold text-[var(--color-primary)]">Total Amount</span>
                                <span className="text-lg font-bold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
                                    ₹{(
                                        selectedInvoice.rent +
                                        selectedInvoice.utility +
                                        selectedInvoice.maintenance +
                                        selectedInvoice.lateFee
                                    ).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-card)]">
                                <Calendar size={13} />
                                Due: {selectedInvoice.dueDate}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-card)] hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                            >
                                Close
                            </button>

                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                                <Download size={15} />
                                Download
                            </button>

                            {role === "tenant" && (
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[#0091e6] transition-all shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.97]">
                                    <CreditCard size={15} />
                                    Pay Rent
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Invoice;