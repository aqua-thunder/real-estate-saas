import React, { useEffect } from "react";
import { useState } from "react";
import { UserPlus, Search, Edit, Trash2, X } from "lucide-react";
import { useAuth } from "../../store/auth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../store/ToastContext";


const User = () => {
    const { users } = useAuth();
    const { toast } = useToast();

    const [userList, setUserList] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [addUser, setAddUser] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "TENANT",
    });

    useEffect(() => {
        if (Array.isArray(users)) {
            setUserList(users);
        }
    }, [users]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAddUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            const url = isEditing
                ? `http://localhost:7000/api/admin/user/${editId}`
                : "http://localhost:7000/api/admin/user";

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(addUser),
            });

            const res_data = await response.json();

            if (response.ok) {
                if (isEditing) {
                    setUserList((prev) =>
                        prev.map((u) =>
                            u._id === editId ? res_data.user : u
                        )
                    );
                    toast.success("User Updated Successfully");
                } else {
                    // Backend returns 'newUser' for create
                    setUserList((prev) => [...prev, res_data.newUser]);
                    toast.success("User Added Successfully");
                }

                setAddUser({
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    role: "TENANT",
                });

                setIsEditing(false);
                setEditId(null);
                setOpenForm(false);
            } else {
                toast.error(res_data.msg || res_data.message || "Error occurred");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const handleEdit = (user) => {
        setAddUser({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            role: user.role,
            password: "", // don't preload password
        });

        setEditId(user._id);
        setIsEditing(true);
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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                setUserList((prev) =>
                    prev.filter((user) => user._id !== id)
                );
                toast.success("User Deleted Successfully");
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };




    return (
        <div className="bg-[var(--bg-main)] p-8 font-[var(--font-body)] text-[var(--text-secondary)]">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div className="relative w-full md:w-1/3">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-card)]"
                    />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full bg-[var(--bg-card)] border border-[#2a3649] rounded-[var(--border-radius)] py-3 pl-11 pr-4 text-sm text-[var(--text-secondary)] placeholder:text-[var(--text-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                    />
                </div>


                <Button onClick={() => setOpenForm(true)}>
                    <UserPlus size={18} />
                    Add User
                </Button>
            </div>

            <div className="bg-[var(--bg-card)] rounded-[var(--border-radius)] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">

                        <thead className="bg-[rgba(0,161,255,0.08)] text-[var(--text-primary)] text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">
                            {!Array.isArray(userList) || userList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-[var(--text-card)]">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                userList.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="border-t border-[#2a3649] hover:bg-[rgba(0,161,255,0.05)] transition"
                                    >
                                        <td className="px-6 py-4 font-medium">{user.name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.phone || "—"}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs bg-[rgba(0,161,255,0.15)] text-[var(--text-primary)]">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isBlocked
                                                    ? "bg-red-500/20 text-red-400"
                                                    : user.isActive
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-yellow-500/20 text-yellow-400"
                                                    }`}
                                            >
                                                {user.isBlocked
                                                    ? "Blocked"
                                                    : user.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => handleEdit(user)} className="p-2 rounded-lg hover:bg-[rgba(0,161,255,0.1)] text-[var(--text-card)] hover:text-[var(--color-primary)] transition">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(user._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-card)] hover:text-red-400 transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                            {isEditing ? "Update User" : "Add New User"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    label="Name"
                                    name="name"
                                    value={addUser.name}
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
                                    value={addUser.email}
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
                                    value={addUser.password}
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
                                    value={addUser.phone}
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
                                    value={addUser.role}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg-card)] border border-[var(--color-card)] rounded-lg px-4 py-2.5 text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                                    required
                                >
                                    <option value="TENANT">Tenant</option>
                                    <option value="OWNER">Owner</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="TECHNICIAN">Technician</option>
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
