import React, { useState } from "react";
import Button from "../components/ui/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import Input from "../components/ui/Input";

const SignUpPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const navigate = useNavigate();
  const { storetokenInLS } = useAuth();

  // ✅ Works for Input + Select
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:7000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const res_data = await response.json();

      if (response.ok) {
        storetokenInLS(res_data.token);
        navigate("/");
      }
    } catch (error) {
      console.log("Register error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row text-white">
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

        <button className="w-fit px-6 py-3 rounded-lg bg-[var(--color-primary)]">
          Learn More
        </button>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[70%] flex items-center justify-center px-4 bg-[var(--bg-card)]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm sm:max-w-md rounded-2xl p-6 sm:p-8 shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-1">
            Sign Up
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Your Admin Dashboard
          </p>

          <div className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            {/* ✅ Role Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text-secondary)]">
                Role
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-[var(--bg-main)]
                  text-white
                  border border-white/10
                  focus:outline-none
                  focus:ring-1 focus:ring-[var(--color-primary)]
                "
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="OWNER">Owner</option>
                <option value="MANAGER">Manager</option>
                <option value="TENANT">Tenant</option>
                <option value="TECHNICIAN">Technician</option>
              </select>
            </div>

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="primary" className="w-full mt-6" htmlType="submit">
            Sign Up
          </Button>

          <p className="text-center text-xs sm:text-sm text-[var(--text-secondary)] mt-6">
            Already have an account?{" "}
            <NavLink to="/" className="text-[var(--color-primary)] hover:underline">
              Sign In
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
