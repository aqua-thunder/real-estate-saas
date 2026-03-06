import React, { useEffect, useState } from "react";
import { FileText, Home, CreditCard, IndianRupee, ClipboardList, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../store/auth";

export default function Lease() {
    const { token } = useAuth();
    const [leaseData, setLeaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLeaseData = async () => {
        try {
            const response = await fetch("http://localhost:7000/api/tenant/getmy-lease", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setLeaseData(data.lease);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to fetch lease data");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchLeaseData();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-primary)]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
                    <p className="text-lg font-medium">Loading your lease details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-[var(--bg-main)] p-6">
                <div className="bg-[var(--bg-card)] border border-red-500/50 rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={56} />
                    <h2 className="text-xl font-bold text-white mb-2">Error Loading Lease</h2>
                    <p className="text-[var(--text-secondary)] mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!leaseData) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffInMs = endDate - startDate;
        const diffInMonths = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
        return `${diffInMonths} Months`;
    };

    // Static rules as they might not be in DB yet
    const rules = [
        "Rent must be paid before the 5th of each month",
        "No subleasing allowed",
        "Pets allowed only with permission",
        "Maintenance issues must be reported through the system",
    ];

    return (
        <div className="p-6 bg-[var(--bg-main)] min-h-screen text-[var(--text-secondary)] font-[var(--font-body)]">

            {/* Page Title & Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[var(--font-heading)] tracking-tight">
                        Lease Agreement
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage and view your occupancy details</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--color-main)] px-4 py-2 rounded-lg hover:bg-[var(--color-main)]/10 transition-all text-sm font-medium">
                        <FileText size={16} />
                        Download PDF
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">

                {/* 1 Basic Lease Information */}
                <div className="bg-[var(--bg-card)] rounded-2xl p-7 border border-[var(--color-main)]/30 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <FileText size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-6 text-[var(--text-primary)]">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <FileText size={24} className="text-blue-500" />
                        </div>
                        <h2 className="text-xl font-bold">Lease Information</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-y-5 text-sm">
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Lease ID</p>
                            <p className="text-white font-medium text-lg">LSE-{leaseData._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${leaseData.leaseStatus === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                {leaseData.leaseStatus}
                            </span>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Start Date</p>
                            <p className="text-white font-medium">{formatDate(leaseData.leaseStart)}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">End Date</p>
                            <p className="text-white font-medium">{formatDate(leaseData.leaseEnd)}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Duration</p>
                            <p className="text-white font-medium">{calculateDuration(leaseData.leaseStart, leaseData.leaseEnd)}</p>
                        </div>
                    </div>
                </div>

                {/* 2 Property Details */}
                <div className="bg-[var(--bg-card)] rounded-2xl p-7 border border-[var(--color-main)]/30 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Home size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-6 text-[var(--text-primary)]">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Home size={24} className="text-purple-500" />
                        </div>
                        <h2 className="text-xl font-bold">Residency Details</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-y-5 text-sm">
                        <div className="col-span-2">
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Property</p>
                            <p className="text-white font-semibold text-lg">{leaseData.propertyId?.propertyName || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Unit Number</p>
                            <p className="text-white font-medium">{leaseData.unitId?.unitNumber || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Floor</p>
                            <p className="text-white font-medium">{leaseData.floorId?.name || "N/A"}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Full Address</p>
                            <p className="text-white/80 leading-relaxed">{leaseData.propertyId?.address || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* 3 Rent Details */}
                <div className="bg-[var(--bg-card)] rounded-2xl p-7 border border-[var(--color-main)]/30 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <IndianRupee size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-6 text-[var(--text-primary)]">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <IndianRupee size={24} className="text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold">Financial Terms</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-y-5 text-sm">
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Monthly Rent</p>
                            <p className="text-emerald-400 font-bold text-xl">{formatCurrency(leaseData.rent)}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Security Deposit</p>
                            <p className="text-white font-bold text-xl">{formatCurrency(leaseData.deposit)}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Rent Due Date</p>
                            <p className="text-white font-medium">5th of every month</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Late Fee</p>
                            <p className="text-orange-400 font-medium">{formatCurrency(leaseData.lateFees || 100)} / day</p>
                        </div>
                    </div>
                </div>

                {/* 4 Payment Summary */}
                <div className="bg-[var(--bg-card)] rounded-2xl p-7 border border-[var(--color-main)]/30 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <CreditCard size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-6 text-[var(--text-primary)]">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <CreditCard size={24} className="text-amber-500" />
                        </div>
                        <h2 className="text-xl font-bold">Payment Status</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-y-5 text-sm">
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Paid to Date</p>
                            <p className="text-white font-bold text-lg">{formatCurrency(leaseData.totalCollected)}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Outstanding</p>
                            <p className="text-red-400 font-bold text-lg">{formatCurrency(leaseData.pending)}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Payment Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${leaseData.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                {leaseData.paymentStatus}
                            </span>
                        </div>
                        <div>
                            <p className="text-[var(--text-card)] mb-1 uppercase text-xs font-bold tracking-wider">Maintenance</p>
                            <p className="text-white font-medium">{formatCurrency(leaseData.maintenanceCost || 0)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5 Lease Terms & Rules */}
            <div className="bg-[var(--bg-card)] rounded-2xl p-7 border border-[var(--color-main)]/30 shadow-lg mt-8 mb-10">
                <div className="flex items-center gap-3 mb-6 text-[var(--text-primary)]">
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                        <ClipboardList size={24} className="text-rose-500" />
                    </div>
                    <h2 className="text-xl font-bold">Agreement Clauses & Rules</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <ul className="space-y-4">
                        {rules.map((rule, index) => (
                            <li key={index} className="flex items-start gap-3 group">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 group-hover:scale-150 transition-transform"></span>
                                <span className="text-sm text-[var(--text-card)] leading-relaxed group-hover:text-white transition-colors">{rule}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-[var(--bg-main)]/50 rounded-xl p-6 border border-[var(--color-main)]/20 flex flex-col justify-center">
                        <p className="text-sm text-[var(--text-card)] italic mb-4">
                            "By occupying the premises, the tenant agrees to all terms and conditions set forth in the signed agreement and project guidelines."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-[var(--color-main)]/30 rounded-full flex items-center justify-center font-bold text-white">AD</div>
                            <div>
                                <p className="text-white text-sm font-bold">Adminstrator</p>
                                <p className="text-[var(--text-card)] text-xs">Verified Management</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
