import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import IntentDetails from './pages/IntentDetails'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home page with search bar */}
      <Route path="/" element={<Home />} />

      {/* Intent detail page */}
      <Route path="/intent/:intentId" element={<IntentDetails />} />

      {/* Fallback: redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
