import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './store/auth.jsx'
import { ToastContainer } from 'react-toastify';
import { ToastProvider } from './store/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ToastProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ToastProvider>
  </AuthProvider>
  ,
)
