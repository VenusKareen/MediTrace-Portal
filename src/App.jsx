import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import PendingUsers from './pages/admin/PendingUsers'
import AllProducts from './pages/admin/AllProducts'
import ScanLogs from './pages/admin/ScanLogs'
import Reports from './pages/admin/Reports'
import MfgDashboard from './pages/manufacturer/MfgDashboard'
import MyProducts from './pages/manufacturer/MyProducts'
import RegisterProduct from './pages/manufacturer/RegisterProduct'
import Batches from './pages/manufacturer/Batches'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute role="admin"><PendingUsers /></PrivateRoute>} />
        <Route path="/admin/products" element={<PrivateRoute role="admin"><AllProducts /></PrivateRoute>} />
        <Route path="/admin/scanlogs" element={<PrivateRoute role="admin"><ScanLogs /></PrivateRoute>} />
        <Route path="/admin/reports" element={<PrivateRoute role="admin"><Reports /></PrivateRoute>} />
        <Route path="/manufacturer" element={<PrivateRoute role="manufacturer"><MfgDashboard /></PrivateRoute>} />
        <Route path="/manufacturer/products" element={<PrivateRoute role="manufacturer"><MyProducts /></PrivateRoute>} />
        <Route path="/manufacturer/register" element={<PrivateRoute role="manufacturer"><RegisterProduct /></PrivateRoute>} />
        <Route path="/manufacturer/batches" element={<PrivateRoute role="manufacturer"><Batches /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}