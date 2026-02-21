import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Navigation, Plus, X, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../store/auth';
import Input from '../components/ui/Input';
import Button from "../components/ui/Button";
import { useToast } from '../store/ToastContext';

const Location = () => {
    const { toast } = useToast();
    const { location } = useAuth();
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        if (Array.isArray(location)) {
            setLocations(location);
        }
    }, [location]);

    const [openForm, setOpenForm] = useState(false);
    const [locationInState, setLocationInState] = useState({
        country: "",
        state: "",
        city: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setLocationInState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Change the status of location
    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:7000/api/admin/locations/${id}/toggle`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );

            if (response.ok) {

                // ✅ Update UI instantly
                setLocations((prev) =>
                    prev.map((loc) =>
                        loc._id === id ? { ...loc, isActive: newStatus === "active" } : loc
                    )
                );

                toast.success(
                    `Location ${newStatus === "active" ? "Activated" : "Disabled"} Successfully`
                );

            } else {
                toast.error("Failed to update status");
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    // Handle Edit
    const handleEdit = (loc) => {
        setLocationInState({
            country: loc.country,
            state: loc.state,
            city: loc.city
        });
        setEditId(loc._id);
        setIsEditing(true);
        setOpenForm(true);
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this location?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:7000/api/admin/locations/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setLocations((prev) => prev.filter((loc) => loc._id !== id));
                toast.success("Location Deleted Successfully");
            } else {
                toast.error("Failed to delete location");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };



    // Submit form 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const url = isEditing
                ? `http://localhost:7000/api/admin/locations/${editId}`
                : "http://localhost:7000/api/admin/locations";
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url,
                {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(locationInState)
                }
            );

            const res_data = await response.json();

            if (response.ok) {
                if (isEditing) {
                    setLocations((prev) =>
                        prev.map((loc) => (loc._id === editId ? res_data.location : loc))
                    );
                    toast.success("Location Updated Successfully");
                } else {
                    // Refresh or add manually? Re-fetching is safer or just use response
                    // Since it's a SPA, manually updating is better for UX
                    // But backend returns 'generateLocation', let's fix it to be consistent
                    const newLoc = res_data.generateLocation || res_data.location;
                    setLocations((prev) => [...prev, newLoc]);
                    toast.success("Location Added Successfully");
                }

                setLocationInState({
                    country: "",
                    state: "",
                    city: ""
                });
                setIsEditing(false);
                setEditId(null);
                setOpenForm(false);
            } else {
                toast.error(res_data.message || "Error occurred");
            }
        } catch (error) {
            console.log("Submit Error:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--color-card)]">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)] font-[var(--font-heading)]">
                        Location Management
                    </h2>
                    <p className="text-[var(--text-card)] text-sm mt-1">
                        Manage operating regions and cities
                    </p>
                </div>


                <Button onClick={() => {
                    setIsEditing(false);
                    setLocationInState({ country: "", state: "", city: "" });
                    setOpenForm(true);
                }}>
                    <Plus size={20} />
                    <span className="font-medium">Add Location</span>
                </Button>
            </div>

            {/* Location Table */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--color-card)] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-card)] bg-[var(--color-card)]/50">
                                <th className="p-4 font-bold text-[var(--text-secondary)]">#</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)]">Country</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)]">State</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)]">City</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)]">Status</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(locations) && locations.map((item, index) => (
                                <tr key={item._id} className={`border-b border-[var(--color-card)] hover:bg-[var(--color-card)]/30 transition-colors ${!item.isActive ? "opacity-60 grayscale" : ""}`}>
                                    <td className="p-4 text-[var(--text-card)]">{index + 1}</td>
                                    <td className="p-4 font-medium text-[var(--text-secondary)]">{item.country}</td>
                                    <td className="p-4 text-[var(--text-card)]">{item.state}</td>
                                    <td className="p-4 text-[var(--text-card)]">{item.city}</td>
                                    <td className="p-4">
                                        <select
                                            value={item.isActive ? "active" : "disabled"}
                                            onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                            className="px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full border border-[var(--color-card)] bg-[var(--bg-card)] text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
                                        >
                                            <option value="active">Active</option>
                                            <option value="disabled">Disable</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="Edit Location"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete Location"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {openForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
                    <div className="bg-[var(--bg-card)] w-full max-w-md p-6 rounded-2xl border border-[var(--color-card)] shadow-xl relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setOpenForm(false)}
                            className="absolute top-4 right-4 text-[var(--text-card)] hover:text-[var(--color-primary)]"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-[var(--text-secondary)] mb-6">
                            {isEditing ? "Update Location" : "Add New Location"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    label="Country"
                                    name="country"
                                    value={locationInState.country}
                                    onChange={handleChange}
                                    placeholder="Enter country name"
                                    variant='formInput'
                                    className='text-sm'
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    label="State"
                                    name="state"
                                    value={locationInState.state}
                                    onChange={handleChange}
                                    placeholder="Enter state name"
                                    variant='formInput'
                                    className='text-sm'
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    label="City"
                                    name="city"
                                    value={locationInState.city}
                                    onChange={handleChange}
                                    placeholder="Enter city name"
                                    variant='formInput'
                                    className='text-sm'
                                    required
                                />
                            </div>

                            <Button type="primary" className="w-full" htmlType="submit">
                                {isEditing ? "Update Location" : "Save Location"}
                            </Button>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Location;
