import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useToast } from "../store/ToastContext";
import { Plus, Edit, Trash2, X, Shield, Users, Database, LayoutGrid, Search, Layers } from "lucide-react";

const initialState = {
    name: "",
    priceMonthly: "",
    priceYearly: "",
    propertyLimit: "",
    unitLimit: "",
    managerLimit: "",
    storageLimitMB: 500,
    trialDays: 0,
    isActive: true
};

const Subscriptions = () => {
    const { toast } = useToast();
    const [openForm, setOpenForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(initialState);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const isEditing = Boolean(editId);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:7000/api/admin/plans", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setPlans(data.data || []);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const resetForm = () => {
        setFormData(initialState);
        setEditId(null);
        setOpenForm(false);
    };

    const handleEdit = (plan) => {
        setFormData({
            name: plan.name,
            priceMonthly: plan.priceMonthly,
            priceYearly: plan.priceYearly,
            propertyLimit: plan.propertyLimit,
            unitLimit: plan.unitLimit,
            managerLimit: plan.managerLimit,
            storageLimitMB: plan.storageLimitMB,
            trialDays: plan.trialDays,
            isActive: plan.isActive
        });
        setEditId(plan._id);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subscription plan?")) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:7000/api/admin/plan/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                toast.success("Plan deleted successfully");
                fetchPlans();
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to delete plan");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const url = isEditing
                ? `http://localhost:7000/api/admin/plan/${editId}`
                : "http://localhost:7000/api/admin/plan";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(isEditing ? "Plan Updated Successfully" : "Plan Added Successfully");
                resetForm();
                fetchPlans();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const filteredPlans = plans.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeIn p-6">
            {/* Controls Bar */}
            <div className="relative overflow-hidden bg-[var(--bg-card)] p-4 sm:p-5 rounded-3xl border border-[var(--color-card)] shadow-sm">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent"></div>

                <div className="flex flex-col xl:flex-row gap-3 xl:gap-4 xl:items-center xl:justify-between">
                    <div className="relative w-full xl:max-w-xl">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-card)]" />
                        <input
                            type="text"
                            placeholder="Search subscription plans by name..."
                            className="w-full h-12 bg-[var(--color-card)]/90 border border-transparent rounded-2xl pl-12 pr-4 text-sm text-[var(--text-secondary)] placeholder-[var(--text-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/70 focus:border-[var(--color-primary)]/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div>
                        <Button
                            onClick={() => { resetForm(); setOpenForm(true); }}
                            className="h-12 px-5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 border-none shadow-lg shadow-[var(--color-primary)]/30 mt-0"
                        >
                            <Plus size={19} className="mr-2" />
                            <span className="font-bold">Create Plan</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Grid of Plan Cards */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[var(--text-card)] font-medium animate-pulse">Syncing subscription models...</p>
                </div>
            ) : filteredPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map((plan) => (
                        <div key={plan._id} className="group relative bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--color-card)] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            {/* Decorative Background Element */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl group-hover:bg-[var(--color-primary)]/10 transition-colors"></div>

                            {/* Plan Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-[var(--color-primary)]/10 rounded-2xl text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                                        <Layers size={22} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-[var(--text-secondary)] tracking-tight">{plan.name}</h4>
                                        <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${plan.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            {plan.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(plan)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all" title="Edit Plan"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(plan._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Delete Plan"><Trash2 size={18} /></button>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="mb-8 p-6 bg-[var(--color-card)]/30 rounded-3xl border border-white/5">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-[var(--text-secondary)]">${plan.priceMonthly}</span>
                                    <span className="text-[var(--text-card)] font-bold text-sm">/ month</span>
                                </div>
                                <div className="mt-2 text-xs font-bold text-green-500/80 uppercase tracking-wider">
                                    Annual billing: ${plan.priceYearly}/yr
                                </div>
                            </div>

                            {/* Features/Limits List */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3 text-[var(--text-card)] font-semibold">
                                        <LayoutGrid size={16} className="text-[var(--color-primary)]" />
                                        Property Limit
                                    </div>
                                    <span className="font-black text-[var(--text-secondary)]">{plan.propertyLimit} Units</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3 text-[var(--text-card)] font-semibold">
                                        <Layers size={16} className="text-purple-500" />
                                        Unit Capacity
                                    </div>
                                    <span className="font-black text-[var(--text-secondary)]">{plan.unitLimit} Units</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3 text-[var(--text-card)] font-semibold">
                                        <Users size={16} className="text-orange-500" />
                                        Manager Access
                                    </div>
                                    <span className="font-black text-[var(--text-secondary)]">{plan.managerLimit} Seats</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3 text-[var(--text-card)] font-semibold">
                                        <Database size={16} className="text-blue-400" />
                                        Cloud Storage
                                    </div>
                                    <span className="font-black text-[var(--text-secondary)]">{plan.storageLimitMB}MB</span>
                                </div>
                            </div>

                            {/* Trial Footer */}
                            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                <Shield size={14} className="text-[var(--text-card)]" />
                                <span className="text-[10px] font-bold text-[var(--text-card)] uppercase tracking-widest">
                                    {plan.trialDays > 0 ? `${plan.trialDays} Day Free Trial available` : 'No Free Trial'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[var(--bg-card)] rounded-[3rem] border border-[var(--color-card)] p-20 text-center shadow-xl">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 bg-[var(--color-card)] rounded-full flex items-center justify-center text-[var(--text-card)] border-4 border-[var(--color-card)] border-dashed animate-pulse">
                            <Shield size={40} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-[var(--text-secondary)] tracking-tight">No Tiers Found</h3>
                            <p className="text-[var(--text-card)] text-sm max-w-xs mx-auto mt-2">Scale your business by defining new subscription models.</p>
                        </div>
                        <Button onClick={() => setOpenForm(true)} className="rounded-2xl px-12 py-4">Establish First Plan</Button>
                    </div>
                </div>
            )}


            {/* Modal Form */}
            {openForm && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xl animate-fadeIn" onClick={resetForm}></div>

                    <div className="bg-[var(--bg-card)] w-full max-w-2xl p-0 rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className="p-8 pb-4 flex justify-between items-center relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-[var(--text-secondary)] tracking-tight">
                                    {isEditing ? "Modify Tier" : "Define New Tier"}
                                </h3>
                                <p className="text-[var(--text-card)] font-medium mt-1">Configure subscription barriers and pricing models</p>
                            </div>
                            <button onClick={resetForm} className="p-3 bg-[var(--color-card)] hover:bg-white/10 rounded-2xl text-[var(--text-secondary)] transition-all"><X size={24} /></button>
                        </div>

                        <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 rounded-full mx-8 mb-6"></div>

                        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6 max-h-[70vh] overflow-y-auto relative z-10 custom-scrollbar">
                            <div className="space-y-6">
                                <Input
                                    variant="formInput"
                                    type="text"
                                    name="name"
                                    label="Plan Name"
                                    placeholder="e.g. Enterprise, Professional"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="rounded-2xl bg-[var(--color-card)] border-white/10"
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        variant="formInput"
                                        type="number"
                                        name="priceMonthly"
                                        label="Monthly Price ($)"
                                        value={formData.priceMonthly}
                                        onChange={handleChange}
                                        className="rounded-2xl bg-[var(--color-card)] border-white/10"
                                        required
                                    />
                                    <Input
                                        variant="formInput"
                                        type="number"
                                        name="priceYearly"
                                        label="Yearly Price ($)"
                                        value={formData.priceYearly}
                                        onChange={handleChange}
                                        className="rounded-2xl bg-[var(--color-card)] border-white/10"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <Input
                                        variant="formInput"
                                        type="number"
                                        name="propertyLimit"
                                        label="Property Limit"
                                        value={formData.propertyLimit}
                                        onChange={handleChange}
                                        className="rounded-2xl bg-[var(--color-card)] border-white/10"
                                        required
                                    />
                                    <Input
                                        variant="formInput"
                                        type="number"
                                        name="unitLimit"
                                        label="Unit Limit"
                                        value={formData.unitLimit}
                                        onChange={handleChange}
                                        className="rounded-2xl bg-[var(--color-card)] border-white/10"
                                        required
                                    />
                                    <Input
                                        variant="formInput"
                                        type="number"
                                        name="managerLimit"
                                        label="Manager Limit"
                                        value={formData.managerLimit}
                                        onChange={handleChange}
                                        className="rounded-2xl bg-[var(--color-card)] border-white/10"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        variant="formInput"
                                        type="number"
                                        name="storageLimitMB"
                                        label="Storage Limit (MB)"
                                        value={formData.storageLimitMB}
                                        onChange={handleChange}
                                        className="rounded-2xl bg-[var(--color-card)] border-white/10"
                                        required
                                    />
                                    <Input
                                        variant="formInput"
                                        type="number"
                                        name="trialDays"
                                        label="Trial Period (Days)"
                                        value={formData.trialDays}
                                        onChange={handleChange}
                                        className="rounded-2xl bg-[var(--color-card)] border-white/10"
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-[var(--color-card)]/50 rounded-2xl border border-white/10">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-bold text-[var(--text-secondary)] cursor-pointer">
                                        Activate this plan immediately
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-[var(--bg-card)] mt-4 border-t border-white/5">
                                <Button
                                    type="secondary"
                                    className="flex-1 py-4 text-[var(--text-secondary)] rounded-2xl font-bold mt-0"
                                    onClick={resetForm}
                                >
                                    Discard
                                </Button>
                                <Button
                                    htmlType="submit"
                                    className="flex-1 py-4 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 rounded-2xl font-black text-white border-none mt-0"
                                >
                                    {isEditing ? "Update Tier" : "Establish Tier"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--color-card);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default Subscriptions;

