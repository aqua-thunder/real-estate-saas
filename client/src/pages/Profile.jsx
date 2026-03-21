import React, { useEffect, useState } from "react";
import Input from "../components/ui/Input";
import { useAuth } from "../store/auth";
import { useToast } from "../store/ToastContext";
import Button from "../components/ui/Button";
import {
   User,
   Mail,
   Phone,
   Camera,
   Save,
   ShieldCheck
} from "lucide-react";

const Profile = () => {
   const { user, setUser } = useAuth();
   const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "" });
   const { toast } = useToast();
   const [isSavingProfile, setIsSavingProfile] = useState(false);

   useEffect(() => {
      if (user) {
         setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || ""
         });
      }
   }, [user]);

   const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
         ...prev,
         [name]: value
      }));
   };


   const handleSave = async () => {
      try {
         setIsSavingProfile(true);
         const token = localStorage.getItem("token");

         const response = await fetch("http://localhost:7000/api/auth/profile", {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
               name: formData.name,
               email: formData.email,
               phone: formData.phone
            })
         });

         const data = await response.json();

         if (response.ok) {
            setUser(data.user);
            toast.success(data.message || "Profile updated successfully");
         } else {
            toast.error(data.message || "Failed to update profile");
         }
      } catch (error) {
         console.error("Profile update error:", error);
         toast.error("Something went wrong while updating profile");
      } finally {
         setIsSavingProfile(false);
      }
   };


   return (
      <div className="max-h-screen bg-[var(--bg-main)]  p-4 sm:p-6 lg:p-2 space-y-5 font-['Inter']">

         {/* Header Area */}
         <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="space-y-1">
               <h1 className="font-black text-[var(--color-secondary)] tracking-tight">Profile & Security</h1>

            </div>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
               {/* Personal Card */}
               <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] p-10 flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gray-50 transition-colors" />

                  <div className="relative z-10 mt-6 mb-8">
                     <div className="w-28 h-28 rounded-[3rem] bg-white p-2 shadow-2xl transition-all duration-500">
                        <div className="w-full h-full rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-5xl font-black text-white transition-all">
                           {formData?.name?.[0] || "U"}
                        </div>
                     </div>
                     <Button
                        variant="secondary"
                        size="xs"
                        iconOnly
                        icon={<Camera size={18} />}
                        className="absolute bottom-2 right-2 shadow-xl hover:bg-slate-900 hover:text-white"
                     />
                  </div>

                  <div className="space-y-2 relative z-10 w-full">
                     <h3 className="text-2xl font-black text-[var(--color-secondary)] tracking-tight uppercase">{formData?.name}</h3>
                     <div className="inline-flex px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                        {formData?.role}
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Personal Information Form */}
            <div className="lg:col-span-2">
               <section className="bg-white rounded-[4rem] border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
                  <div className="p-10 sm:p-5 border-b border-gray-50 flex items-center justify-between">
                     <div className="space-y-1">
                        <h2 className="text-2xl font-black text-[var(--color-secondary)] flex items-center gap-3 uppercase">
                           Personal Information
                        </h2>
                     </div>
                     <div className="p-4 bg-gray-50 text-[var(--color-secondary)] rounded-2xl border border-gray-100">
                        <User size={24} />
                     </div>
                  </div>

                  <div className="p-10 sm:p-5 space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-[var(--color-secondary)] uppercase tracking-[0.2em] ml-2">Full Name</label>
                           <div className="relative flex items-center">
                              <User size={16} className="absolute left-6 text-gray-400" />
                              <input
                                 type="text"
                                 name="name"
                                 value={formData.name}
                                 onChange={handleChange}
                                 className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-[2rem] pl-14 pr-8 py-5 text-sm font-black text-[var(--color-secondary)] shadow-sm focus:outline-none transition-all"
                                 placeholder="Full Name"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-[var(--color-secondary)] uppercase tracking-[0.2em] ml-2">Email Address</label>
                           <div className="relative flex items-center">
                              <Mail size={16} className="absolute left-6 text-gray-400" />
                              <input
                                 type="email"
                                 name="email"
                                 value={formData.email}
                                 onChange={handleChange}
                                 className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-[2rem] pl-14 pr-8 py-5 text-sm font-black text-[var(--color-secondary)] shadow-sm focus:outline-none transition-all"
                                 placeholder="Email Address"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-[var(--color-secondary)] uppercase tracking-[0.2em] ml-2">Phone Number</label>
                           <div className="relative flex items-center">
                              <Phone size={16} className="absolute left-6 text-gray-400" />
                              <input
                                 type="text"
                                 name="phone"
                                 value={formData.phone}
                                 onChange={handleChange}
                                 className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-[2rem] pl-14 pr-8 py-5 text-sm font-black text-[var(--color-secondary)] shadow-sm focus:outline-none transition-all"
                                 placeholder="Phone Number"
                              />
                           </div>
                        </div>
                        <div className="space-y-2 opacity-60">
                           <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-2">Assigned Role</label>
                           <div className="relative flex items-center">
                              <ShieldCheck size={16} className="absolute left-6 text-gray-400" />
                              <input
                                 type="text"
                                 value={formData.role}
                                 readOnly
                                 className="w-full bg-gray-100 border border-transparent rounded-[2rem] pl-14 pr-8 py-5 text-sm font-black text-gray-500 cursor-not-allowed shadow-none"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-end pt-6">
                        <Button
                           onClick={handleSave}
                           loading={isSavingProfile}
                           variant="primary"
                           size="lg"
                           icon={<Save size={16} />}
                        >
                           Save Profile
                        </Button>
                     </div>
                  </div>
               </section>
            </div>
         </div>
         {/* Global Animations */}
         <style>{`
                @keyframes fade-in {
                   from { opacity: 0; transform: translateY(20px); }
                   to { opacity: 1; transform: translateY(0); }
                }
                .animate-in {
                   animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1);
                }
             `}</style>
      </div>
   );
};

export default Profile;
