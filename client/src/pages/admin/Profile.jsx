import React, { useState } from "react";
import Input from "../../components/ui/Input";
import { useAuth } from "../../store/auth";
import { useToast } from "../../store/ToastContext";

const Profile = () => {
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handlePasswordFieldChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        const { currentPassword, newPassword, confirmPassword } = passwordForm;

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill all password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        try {
            setIsUpdatingPassword(true);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:7000/api/auth/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Password updated successfully");
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } else {
                toast.error(data.message || "Failed to update password");
            }
        } catch (error) {
            console.error("Password update error:", error);
            toast.error("Something went wrong while updating password");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-card)] p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* ================= PROFILE INFORMATION ================= */}
                <div className=" rounded-2xl shadow-sm p-6 md:p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-[var(--text-secondary)]">Profile Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Profile Photo */}
                        <div className="md:col-span-2 flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
                                A
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-[var(--text-secondary)] rounded-lg hover:bg-blue-700 transition">
                                Change Photo
                            </button>
                        </div>

                        {/* Full Name */}
                        <div>
                            <Input
                                type="text"
                                name="name"
                                label="Full Name"
                                value={user.name}
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Input
                                type="text"
                                name="email"
                                value={user.email}
                                label="Enter Your Email"
                                placeholder="Enter Email"
                                required

                            />
                        </div>

                        {/* Phone */}

                        <div>
                            <Input
                                type="number"
                                name="phone"
                                value={user.phone}
                                label="Enter Your Phone Number"
                                placeholder="Enter Phone Number"
                                required

                            />
                        </div>
                        {/* Role (Read Only) */}
                        <div>
                            <Input
                                type="text"
                                name="role"
                                value={user.role}
                                label="Your Role"
                                placeholder="Enter Your Role"
                                required

                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button className="px-6 py-2 bg-green-600 text-[var(--text-secondary)] rounded-lg hover:bg-green-700 transition">
                            Update Profile
                        </button>
                    </div>
                </div>

                {/* ================= ACCOUNT SECURITY ================= */}
                <div className=" rounded-2xl shadow-sm p-6 md:p-8 text-[var(--text-secondary)]">
                    <h2 className="text-2xl font-semibold mb-6">Account Security</h2>

                    {/* Change Password */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4 ">Change Password</h3>

                        <form onSubmit={handleUpdatePassword}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                                <Input
                                    type="password"
                                    label="Current Password"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordFieldChange}
                                    required
                                />
                                <Input
                                    type="password"
                                    label="New Password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordFieldChange}
                                    required
                                />
                                <Input
                                    type="password"
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordFieldChange}
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                disabled={isUpdatingPassword}
                                className="mt-4 px-6 py-2 bg-red-600 text-[var(--text-secondary)] rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                            >
                                {isUpdatingPassword ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>

                    {/* Two Factor Authentication */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">
                            Two-Factor Authentication (2FA)
                        </h3>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <p className="text-gray-600">
                                Add extra security to your account using OTP verification.
                            </p>

                            <button
                                onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                                className={`px-6 py-2 rounded-lg text-[var(--text-secondary)] transition ${twoFAEnabled
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-gray-500 hover:bg-gray-600"
                                    }`}
                            >
                                {twoFAEnabled ? "Enabled" : "Enable 2FA"}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
