import React, { useEffect, useState } from "react";
import { UserPlus, Edit, Trash2, X } from "lucide-react";
import { useAuth } from "../store/auth";
import { useToast } from "../store/ToastContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const initialState = {
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "TENANT",
};

const User = () => {
    const { users } = useAuth();
    const { toast } = useToast();

    const [userList, setUserList] = useState([]);
    const [formData, setFormData] = useState(initialState);
    const [openForm, setOpenForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const isEditing = Boolean(editId);

    useEffect(() => {
        if (Array.isArray(users)) setUserList(users);
    }, [users]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                ? `http://localhost:7000/api/admin/user/${editId}`
                : `http://localhost:7000/api/admin/user`;

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok)
                return toast.error(data.msg || data.message || "Error occurred");

            if (isEditing) {
                setUserList((prev) =>
                    prev.map((u) => (u._id === editId ? data.user : u))
                );
                toast.success("User Updated Successfully");
            } else {
                setUserList((prev) => [...prev, data.newUser]);
                toast.success("User Added Successfully");
            }

            resetForm();
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            role: user.role,
            password: "",
        });
        setEditId(user._id);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:7000/api/admin/user/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) return toast.error("Failed to delete user");

            setUserList((prev) => prev.filter((u) => u._id !== id));
            toast.success("User Deleted Successfully");
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--color-card)]">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-secondary)] font-[var(--font-heading)]">
                        User Management
                    </h2>
                    <p className="text-[var(--text-card)] text-sm mt-1">
                        Manage system users and their roles
                    </p>
                </div>

                <Button onClick={() => {
                    setFormData(initialState);
                    setEditId(null);
                    setOpenForm(true);
                }}>
                    <UserPlus size={20} />
                    <span className="font-medium">Add User</span>
                </Button>
            </div>

            {/* User Table */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--color-card)] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--color-card)] bg-[var(--color-card)]/50">
                                <th className="p-4 font-bold text-[var(--text-secondary)]">#</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)]">Name</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)]">Email</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)]">Phone</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)]">Role</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)]">Status</th>
                                <th className="p-4 font-bold text-[var(--text-secondary)] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(userList) && userList.map((user, index) => (
                                <tr key={user._id} className={`border-b border-[var(--color-card)] hover:bg-[var(--color-card)]/30 transition-colors ${!user.isActive ? "opacity-60 grayscale" : ""}`}>
                                    <td className="p-4 text-[var(--text-card)]">{index + 1}</td>
                                    <td className="p-4 font-medium text-[var(--text-secondary)]">{user.name}</td>
                                    <td className="p-4 text-[var(--text-card)]">{user.email}</td>
                                    <td className="p-4 text-[var(--text-card)]">{user.phone || "—"}</td>
                                    <td className="p-4 text-[var(--text-card)]">
                                        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full border border-[var(--color-card)] bg-[var(--bg-card)] text-[var(--text-secondary)]">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[var(--text-card)]">
                                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${user.isBlocked
                                            ? "bg-red-500/20 text-red-400"
                                            : user.isActive
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-yellow-500/20 text-yellow-400"
                                            }`}>
                                            {user.isBlocked ? "Blocked" : user.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="Edit User"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete User"
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

            {/* Modal */}
            {openForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
                    <div className="bg-[var(--bg-card)] w-full max-w-md p-6 rounded-2xl border border-[var(--color-card)] shadow-xl relative">

                        {/* Close Button */}
                        <button
                            onClick={resetForm}
                            className="absolute top-4 right-4 text-[var(--text-card)] hover:text-[var(--color-primary)]"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-[var(--text-secondary)] mb-6">
                            {isEditing ? "Update User" : "Add New User"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter name"
                                    variant='formInput'
                                    className='text-sm'
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    variant='formInput'
                                    className='text-sm'
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={isEditing ? "Leave blank to keep current" : "Enter password"}
                                    variant='formInput'
                                    className='text-sm'
                                    required={!isEditing}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    variant='formInput'
                                    className='text-sm'
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg-card)] border border-[var(--color-card)] rounded-lg px-4 py-2.5 text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                                    required
                                >
                                    <option value="TENANT">Tenant</option>
                                    <option value="OWNER">Owner</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="MAINTENANCE_STAFF">Maintenance Staff</option>
                                    <option value="SUPER_ADMIN">Super Admin</option>
                                </select>
                            </div>

                            <Button type="primary" className="w-full" htmlType="submit">
                                {isEditing ? "Update User" : "Save User"}
                            </Button>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;
