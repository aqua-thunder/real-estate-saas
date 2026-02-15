import React, { useState } from "react";
import Button from "../components/ui/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import Input from "../components/ui/Input";
import { useToast } from '../store/ToastContext';

const SignInPage = () => {
    const { toast } = useToast();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { storetokenInLS } = useAuth();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:7000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const res_data = await response.json();

            if (response.ok) {
                storetokenInLS(res_data.token);
                setUser({ email: "", password: "" });
                navigate("/admin/dashboard")
            } else {
                toast.error(res_data.message)
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className="min-h-screen flex text-white">
            {/* Left Section */}
            <div className="hidden lg:flex lg:w-[30%] flex-col justify-center px-12 xl:px-20 bg-[var(--bg-main)]">
                <h1 className="text-3xl xl:text-4xl font-bold mb-4">
                    Welcome to{" "}
                    <span className="text-[var(--color-primary)]">MaterialM</span>
                </h1>

                <p className="text-[var(--text-secondary)] text-base xl:text-lg mb-8 max-w-md">
                    MaterialM helps developers to build organized and well coded dashboards
                    full of beautiful and rich modules.
                </p>

                <button className="w-fit px-6 py-3 rounded-lg bg-[var(--color-primary)] font-medium hover:opacity-90 transition">
                    Learn More
                </button>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-[70%] flex items-center justify-center px-4 sm:px-6 md:px-8 bg-[var(--bg-card)]">
                <div className="w-full max-w-sm sm:max-w-md rounded-2xl p-6 sm:p-8 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-1">Sign In</h2>
                    <p className="text-[var(--text-secondary)] mb-6">
                        Your Admin Dashboard
                    </p>

                    {/* FORM START */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInput}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleInput}
                            required
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-[var(--text-secondary)]">
                                <input type="checkbox" className="accent-[var(--color-primary)]" />
                                Remember this Device
                            </label>

                            <span className="text-[var(--color-primary)] cursor-pointer hover:underline">
                                Forgot Password?
                            </span>
                        </div>

                        <Button type="primary" className="w-full" htmlType="submit">
                            Sign In
                        </Button>
                    </form>
                    {/* FORM END */}

                    <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
                        New to MaterialM?{" "}
                        <NavLink
                            to="/signup"
                            className="text-[var(--color-primary)] hover:underline"
                        >
                            Create an account
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
