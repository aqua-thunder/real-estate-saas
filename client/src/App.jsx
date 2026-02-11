import React from 'react'
import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PublicRoute from './store/PubliRoute.jsx'
import SignInPage from './auth/SignInPage.jsx'
import SignUpPage from './auth/SignUpPage.jsx'
import ProtectedRoute from './store/ProtectedRoute.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import Dashboard from './pages/admin/dashboard.jsx'


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
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
            </Route>
          </Route>


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
