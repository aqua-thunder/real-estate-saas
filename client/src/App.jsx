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
  const [count, setCount] = useState(0)

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

          {/* Admin routes */}
          <Route element={<ProtectedRoute role={"SUPER_ADMIN"} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<User />} />
              <Route path="/admin/roles" element={<Role />} />
              <Route path="/admin/locations" element={<Location />} />
              <Route path="/admin/properties" element={<Property />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/subscriptions" element={<Subscriptions />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
              <Route path="/admin/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
