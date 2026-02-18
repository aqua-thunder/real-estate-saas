import React, { useEffect, useState } from "react";
import {
    Building2,
    MapPin,
    Home,
    Edit,
    Trash2,
    X,
    Plus,
    DollarSign,
    Users,
    ChevronRight,
    LayoutGrid,
    Search,
    Filter
} from "lucide-react";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const initialState = {
    propertyName: "",
    propertyType: "RESIDENTIAL",
    location: "",
    address: "",
    totalUnit: "",
    isActive: true
};

const Property = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [properties, setProperties] = useState([]);
    const [formData, setFormData] = useState(initialState);
    const [openForm, setOpenForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const isEditing = Boolean(editId);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:7000/api/owner/properties", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                setProperties(data.properties || []);
            } else {
                toast.error(data.message || "Failed to fetch properties");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching properties");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const resetForm = () => {
        setFormData(initialState);
        setEditId(null);
        setOpenForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const url = isEditing
                ? `http://localhost:7000/api/owner/property/${editId}`
                : `http://localhost:7000/api/owner/properties`;

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(isEditing ? "Property Updated Successfully" : "Property Added Successfully");
                fetchProperties();
                resetForm();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const handleEdit = (property) => {
        setFormData({
            propertyName: property.propertyName,
            propertyType: property.propertyType,
            location: property.location,
            address: property.address,
            totalUnit: property.totalUnit,
            isActive: property.isActive
        });
        setEditId(property._id);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:7000/api/owner/property/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success("Property Deleted Successfully");
                setProperties(prev => prev.filter(p => p._id !== id));
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to delete");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const filteredProperties = properties.filter(p =>
        p.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-[var(--bg-card)] rounded-3xl shadow-xl border border-[var(--color-card)] backdrop-blur-md relative overflow-hidden group">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl group-hover:bg-[var(--color-primary)]/10 transition-all duration-700"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-2xl text-white shadow-lg shadow-[var(--color-primary)]/20">
                            <Building2 size={28} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-[var(--text-secondary)] tracking-tight">
                            Property Management
                        </h2>
                    </div>
                    <p className="text-[var(--text-card)] text-sm max-w-md ml-14">
                        Monitor your real estate performance, manage unit occupancy, and track revenue across your portfolio.
                    </p>
                </div>

                <div className="flex gap-3 mt-6 md:mt-0 relative z-10">
                    <Button onClick={() => { resetForm(); setOpenForm(true); }} className="px-6 py-6 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-blue-600 hover:scale-105 transition-transform duration-300 border-none shadow-xl shadow-[var(--color-primary)]/30">
                        <Plus size={20} className="mr-2" />
                        <span className="font-bold">Add Property</span>
                    </Button>
                </div>
            </div>

            {/* Stats Overview (Optional placeholders) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Properties", value: properties.length, icon: Building2, color: "bg-blue-500" },
                    { label: "Total Units", value: properties.reduce((acc, p) => acc + (p.totalUnit || 0), 0), icon: LayoutGrid, color: "bg-purple-500" },
                    { label: "Total Vacant", value: properties.reduce((acc, p) => acc + (p.vacantUnits || 0), 0), icon: Users, color: "bg-green-500" },
                    { label: "Active Revenue", value: `$${properties.reduce((acc, p) => acc + (p.revenue || 0), 0).toLocaleString()}`, icon: DollarSign, color: "bg-orange-500" }
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--color-card)] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color}/5 rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500`}></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-2xl ${stat.color}/20 text-${stat.color.replace('bg-', '')}`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <div className="text-2xl font-black text-[var(--text-secondary)]">{stat.value}</div>
                            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-card)] mt-1">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--bg-card)] p-4 rounded-3xl border border-[var(--color-card)] shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-card)]" />
                    <input
                        type="text"
                        placeholder="Search properties by name or location..."
                        className="w-full bg-[var(--color-card)] border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[var(--color-primary)] text-sm text-[var(--text-secondary)] placeholder-[var(--text-card)] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-card)] rounded-2xl border border-[var(--color-card)] hover:bg-[var(--bg-card)] text-sm font-semibold transition-all">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-card)] rounded-2xl border border-[var(--color-card)] hover:bg-[var(--bg-card)] text-sm font-semibold transition-all">
                        <LayoutGrid size={18} />
                        View
                    </button>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-[var(--bg-card)] rounded-[2rem] border border-[var(--color-card)] shadow-2xl overflow-hidden relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-card)]/30 border-b border-[var(--color-card)]">
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)]">Owner</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)]">Property Details</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)]">Category</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)]">Location</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)]">Capacity</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)]">Performance</th>
                                <th className="p-6 font-bold text-xs uppercase tracking-widest text-[var(--text-card)] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-card)]">
                            {loading ? (
                                <tr><td colSpan="6" className="p-16 text-center text-[var(--text-card)] font-medium animate-pulse">Synchronizing database...</td></tr>
                            ) : filteredProperties.length > 0 ? (
                                filteredProperties.map((property) => (
                                    <tr key={property._id} className="group hover:bg-[var(--color-card)]/20 transition-all duration-300">
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-[var(--text-secondary)] font-semibold">

                                                {property.owner.companyName}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                                    <Home size={22} className="text-blue-500" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[var(--text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">{property.propertyName}</div>
                                                    <div className="text-xs text-[var(--text-card)] font-medium mt-1 truncate max-w-[200px]">{property.address}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${property.propertyType === 'RESIDENTIAL' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                property.propertyType === 'COMMERCIAL' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                    'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                                }`}>
                                                {property.propertyType}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-[var(--text-secondary)] font-semibold">
                                                <MapPin size={14} className="text-red-500/70" />
                                                {property.location}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div>
                                                <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-[var(--text-card)]">
                                                    <span>{property.totalUnit - property.vacantUnits} OCCUPIED</span>
                                                    <span>{Math.round(((property.totalUnit - property.vacantUnits) / property.totalUnit) * 100) || 0}%</span>
                                                </div>
                                                <div className="w-32 h-2 bg-[var(--color-card)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                                        style={{ width: `${((property.totalUnit - property.vacantUnits) / property.totalUnit) * 100 || 0}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-[10px] text-[var(--text-card)] mt-2 uppercase font-black">{property.vacantUnits} Vacant of {property.totalUnit} Total</div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="p-3 bg-green-500/5 rounded-2xl border border-green-500/10">
                                                <div className="text-[10px] font-bold text-green-600/70 uppercase">Total Revenue</div>
                                                <div className="text-lg font-black text-green-600 dark:text-green-400 mt-1">${property.revenue?.toLocaleString() || 0}</div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                <button onClick={() => handleEdit(property)} className="p-3 text-blue-500 hover:bg-blue-500/10 rounded-2xl transition-all"><Edit size={18} /></button>
                                                <button onClick={() => handleDelete(property._id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-24 h-24 bg-[var(--color-card)] rounded-full flex items-center justify-center text-[var(--text-card)] border-4 border-[var(--color-card)] border-dashed animate-spin-slow">
                                                <Building2 size={40} />
                                            </div>
                                            <div className="text-xl font-black text-[var(--text-secondary)] mt-4 tracking-tight">No Estates Found</div>
                                            <p className="text-[var(--text-card)] text-sm max-w-xs">Your portfolio is currently empty. Start building your real estate empire today.</p>
                                            <Button onClick={() => setOpenForm(true)} className="mt-4 rounded-2xl px-10">Add Your First Property</Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Modern & Slick */}
            {openForm && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="absolute inset-0  backdrop-blur-xl animate-fadeIn" onClick={resetForm}></div>

                    <div className="bg-[var(--bg-card)] w-full max-w-xl p-0 rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className="p-8 pb-4 flex justify-between items-center relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-[var(--text-secondary)] tracking-tight">
                                    {isEditing ? "Modify Property" : "Establish Property"}
                                </h3>
                                <p className="text-[var(--text-card)] font-medium mt-1">Configure your real estate asset details</p>
                            </div>
                            <button onClick={resetForm} className="p-3 bg-[var(--color-card)] hover:bg-white/10 rounded-2xl text-[var(--text-secondary)] transition-all"><X size={24} /></button>
                        </div>

                        {/* Decoration Line */}
                        <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 rounded-full mx-8 mb-6"></div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-8 pt-0 space-y-6 max-h-[70vh] overflow-y-auto relative z-10 custom-scrollbar"
                        >
                            <div className="space-y-6">

                                {/* Property Name */}
                                <Input
                                    label="Property Name"
                                    name="propertyName"
                                    value={formData.propertyName}
                                    onChange={handleChange}
                                    placeholder="e.g. Skyline Residency"
                                    variant="formInput"
                                    className="text-sm py-4 rounded-2xl bg-[var(--color-card)] border border-white/10 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition"
                                    required
                                />

                                {/* Category + Units */}
                                <div className="grid grid-cols-2 gap-6">

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                                            Property Category
                                        </label>

                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            className="w-full bg-[var(--color-card)] border border-white/10 rounded-2xl p-4 text-sm font-bold text-[var(--text-secondary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="RESIDENTIAL">Residential</option>
                                            <option value="COMMERCIAL">Commercial</option>
                                            <option value="INDUSTRIAL">Industrial</option>
                                        </select>
                                    </div>

                                    <Input
                                        label="Inventory (Units)"
                                        name="totalUnit"
                                        type="number"
                                        value={formData.totalUnit}
                                        onChange={handleChange}
                                        placeholder="e.g. 24"
                                        variant="formInput"
                                        className="text-sm py-4 rounded-2xl bg-[var(--color-card)] border border-white/10 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition"
                                        required
                                        min="1"
                                    />

                                </div>

                                {/* Location */}
                                <Input
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Manhattan, NYC"
                                    variant="formInput"
                                    className="text-sm py-4 rounded-2xl bg-[var(--color-card)] border border-white/10 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition"
                                    required
                                />

                                {/* Address */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                                        Full Logistics Address
                                    </label>

                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Enter precise location coordinates..."
                                        className="w-full bg-[var(--color-card)] border border-white/10 rounded-2xl p-4 text-sm font-medium text-[var(--text-secondary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition resize-none placeholder-[var(--text-card)]"
                                        required
                                    />
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-[var(--bg-card)] pb-2 mt-4 border-t border-white/5">

                                <Button
                                    type="button"
                                    className="flex-1 py-4 bg-[var(--color-card)] hover:bg-white/10 text-[var(--text-secondary)] rounded-2xl font-bold border border-white/10"
                                    onClick={resetForm}
                                >
                                    Discard
                                </Button>

                                <Button
                                    type="primary"
                                    className="flex-1 py-4 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 rounded-2xl font-black text-white border-none shadow-xl shadow-[var(--color-primary)]/40"
                                    htmlType="submit"
                                >
                                    {isEditing ? "Update Asset" : "Deploy Property"}
                                </Button>

                            </div>
                        </form>

                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
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
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--text-card);
                }
            `}</style>
        </div>
    );
};

export default Property;
