import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../store/ToastContext";
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

            {/* List Table */}
            <div className="bg-[var(--bg-card)] rounded-[2rem] border border-[var(--color-card)] shadow-2xl overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-card)]/30 border-b border-[var(--color-card)]">
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)]">Plan Name</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)]">Pricing</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)] text-center">Limits (Prop/Unit/Mgr)</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)] text-center">Storage</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)] text-center">Status</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-card)]">
                            {loading ? (
                                <tr><td colSpan="6" className="p-16 text-center text-[var(--text-card)] font-medium animate-pulse">Syncing subscription models...</td></tr>
                            ) : filteredPlans.length > 0 ? (
                                filteredPlans.map((plan) => (
                                    <tr key={plan._id} className="group hover:bg-[var(--color-card)]/20 transition-all duration-300">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl text-[var(--color-primary)]">
                                                    <Layers size={18} />
                                                </div>
                                                <div className="font-bold text-[var(--text-secondary)]">{plan.name}</div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="text-sm font-black text-green-500">${plan.priceMonthly}/mo</div>
                                                <div className="text-[10px] text-[var(--text-card)] font-bold uppercase">${plan.priceYearly}/yr</div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-xs font-bold">{plan.propertyLimit}</span>
                                                <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-lg text-xs font-bold">{plan.unitLimit}</span>
                                                <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-lg text-xs font-bold">{plan.managerLimit}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center font-bold text-sm text-[var(--text-secondary)]">
                                            {plan.storageLimitMB}MB
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${plan.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                {plan.isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleEdit(plan)} className="p-3 text-blue-500 hover:bg-blue-500/10 rounded-2xl transition-all"><Edit size={18} /></button>
                                                <button onClick={() => handleDelete(plan._id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-24 h-24 bg-[var(--color-card)] rounded-full flex items-center justify-center text-[var(--text-card)] border-4 border-[var(--color-card)] border-dashed">
                                                <Shield size={40} />
                                            </div>
                                            <div className="text-xl font-black text-[var(--text-secondary)] mt-4 tracking-tight">No Plans Configured</div>
                                            <p className="text-[var(--text-card)] text-sm max-w-xs">Your subscription model is empty. Define your first tier to start scaling.</p>
                                            <Button onClick={() => setOpenForm(true)} className="mt-4 rounded-2xl px-10">Create First Plan</Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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

