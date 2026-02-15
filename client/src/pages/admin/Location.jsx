import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Navigation, Plus, X } from 'lucide-react';
import { useAuth } from '../../store/auth';
import Input from '../../components/ui/Input';
import Button from "../../components/ui/Button";
import { useToast } from '../../store/ToastContext';

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
                        loc._id === id ? { ...loc, status: newStatus } : loc
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



    // Submit form 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:7000/api/admin/locations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(locationInState)
                }
            );

            const res_data = await response.json();

            if (response.ok) {
                console.log("Location Added:", res_data);
                setLocationInState({
                    country: "",
                    state: "",
                    city: ""
                });
                //  Close modal
                setOpenForm(false);
                toast.success("Location Added Successfully")
            } else {
                console.log("Error:", res_data.message);
            }
        } catch (error) {
            console.log("Submit Error:", error);
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

                <button onClick={() => setOpenForm(true)} className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--text-secondary)] px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md active:scale-95">
                    <Plus size={20} />
                    <span className="font-medium">Add Location</span>
                </button>
            </div>

            {/* Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    Array.isArray(locations) && locations.map((item, index) => (

                        <div
                            key={index}
                            className={`
        group rounded-2xl p-6 shadow-sm border
        transition-all duration-300 hover:-translate-y-1 relative overflow-hidden

        ${item.status === "active"
                                    ? "bg-[var(--bg-card)] border-[var(--color-card)] opacity-100"
                                    : "bg-[var(--color-card)] border-[var(--color-card)] opacity-60 grayscale"}
    `}
                        >

                            {/* Decorative Background Icon */}
                            <Globe
                                className="absolute -right-4 -bottom-4 text-[var(--color-primary)] opacity-10 group-hover:scale-110 transition-transform duration-500"
                                size={100}
                            />

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-[rgba(0,161,255,0.1)] text-[var(--color-primary)] rounded-xl group-hover:bg-[var(--color-primary)] group-hover:text-[var(--text-secondary)] transition-colors duration-300">
                                        <MapPin size={24} />
                                    </div>

                                    <select
                                        value={item.status}
                                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                        className=" px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full border border-[var(--color-card)] bg-[var(--bg-card)] text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    >
                                        <option value="active">Active</option>
                                        <option value="disabled">Disable</option>
                                    </select>

                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-[var(--text-secondary)]">
                                        {item.state}
                                    </h3>
                                    <p className="text-[var(--text-card)] font-medium flex items-center gap-2">
                                        {item.state}, {item.country}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-[var(--color-card)] flex flex-col gap-2">
                                    <div className="flex items-center gap-3 text-sm text-[var(--text-card)]">
                                        <Navigation size={16} className="text-[var(--color-primary)]" />
                                        <span>
                                            State:{" "}
                                            <span className="font-semibold text-[var(--text-secondary)]">
                                                {item.state}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-[var(--text-card)]">
                                        <Globe size={16} className="text-[var(--color-primary)]" />
                                        <span>
                                            City:{" "}
                                            <span className="font-semibold text-[var(--text-secondary)]">
                                                {item.city}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {openForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-[var(--bg-card)] w-full max-w-md p-6 rounded-2xl border border-[var(--color-card)] shadow-xl relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setOpenForm(false)}
                            className="absolute top-4 right-4 text-[var(--text-card)] hover:text-[var(--color-primary)]"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-[var(--text-secondary)] mb-6">
                            Add New Location
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
                                Save Location
                            </Button>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Location;
