import React from 'react';
import { MapPin, Globe, Navigation, Plus } from 'lucide-react';
import { useAuth } from '../../store/auth';
const Location = () => {
    const { location } = useAuth();
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 font-[var(--font-heading)]">Location Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage operating regions and cities</p>
                </div>
                <button className="flex items-center gap-2 bg-[#00a1ff] text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-95">
                    <Plus size={20} />
                    <span className="font-medium">Add Location</span>
                </button>
            </div>

            {/* Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    Array.isArray(location) && location.map((item, index) => (

                        <div key={index} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">

                            {/* Decorative Background Icon */}
                            <Globe className="absolute -right-4 -bottom-4 text-slate-50 opacity-50 group-hover:scale-110 transition-transform duration-500" size={100} />

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                        <MapPin size={24} />
                                    </div>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-full">
                                        Active
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-slate-800">{item.state}</h3>
                                    <p className="text-slate-500 font-medium flex items-center gap-2">
                                        {item.state}, {item.country}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Navigation size={16} className="text-blue-400" />
                                        <span>State: <span className="font-semibold text-slate-800">{loc.state}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Globe size={16} className="text-blue-400" />
                                        <span>Country: <span className="font-semibold text-slate-800">{loc.country}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>


                    ))}
            </div>
        </div>
    );
};

export default Location;
