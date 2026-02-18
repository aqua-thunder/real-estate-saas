import React from 'react'
import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import PublicRoute from './store/PubliRoute.jsx'
import SignInPage from './auth/SignInPage.jsx'
import SignUpPage from './auth/SignUpPage.jsx'
import ProtectedRoute from './store/ProtectedRoute.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import User from './pages/admin/User.jsx'
import Role from './pages/admin/Role.jsx'
import Location from './pages/admin/Location.jsx'
import Property from './pages/admin/Property.jsx'
import Settings from './pages/admin/Settings.jsx'
import Reports from './pages/admin/Reports.jsx'
import Subscriptions from './pages/admin/Subscriptions.jsx'
import AuditLogs from './pages/admin/AuditLogs.jsx'
import Profile from './pages/admin/Profile.jsx'
import Logout from './auth/Logout.jsx'


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Auth routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/logout" element={<Logout />} />
          </Route>

          {/* Admin Layout Wrapper */}
          <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "OWNER", "MANAGER", "TENANT", "TECHNICIAN"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* All logged in users can access these */}
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/profile" element={<Profile />} />

              {/* Roles: Super Admin Only */}
              <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
                <Route path="/admin/roles" element={<Role />} />
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="/admin/audit-logs" element={<AuditLogs />} />
              </Route>

              {/* Roles: Super Admin & Manager */}
              <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]} />}>
                <Route path="/admin/users" element={<User />} />
              </Route>

              {/* Roles: Super Admin, Owner, Manager, Technician */}
              <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "OWNER", "MANAGER", "TECHNICIAN"]} />}>
                <Route path="/admin/locations" element={<Location />} />
              </Route>

              {/* Roles: Super Admin, Owner, Manager, Tenant */}
              <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "OWNER", "MANAGER", "TENANT"]} />}>
                <Route path="/admin/properties" element={<Property />} />
              </Route>

              {/* Roles: Super Admin, Owner, Manager */}
              <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "OWNER", "MANAGER"]} />}>
                <Route path="/admin/reports" element={<Reports />} />
              </Route>

              {/* Roles: Super Admin, Owner */}
              <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN", "OWNER"]} />}>
                <Route path="/admin/subscriptions" element={<Subscriptions />} />
              </Route>
            </Route>
          </Route>

          <Route path="/unauthorized" element={<div className="h-screen flex items-center justify-center text-white bg-[var(--bg-main)]">Unauthorized Access</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
