import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/users', label: 'Pending Users', icon: '👥' },
    { to: '/admin/products', label: 'Products', icon: '💊' },
    { to: '/admin/scanlogs', label: 'Scan Logs', icon: '📋' },
    { to: '/admin/reports', label: 'Reports', icon: '🚨' },
  ],
  manufacturer: [
    { to: '/manufacturer', label: 'Dashboard', icon: '📊' },
    { to: '/manufacturer/products', label: 'My Products', icon: '💊' },
    { to: '/manufacturer/register', label: 'Register Product', icon: '➕' },
    { to: '/manufacturer/batches', label: 'Batches & QR', icon: '📦' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = NAV[user?.role] || []

  const linkStyle = ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: '.65rem',
    padding: '.6rem 1rem', borderRadius: 8, margin: '1px .6rem',
    fontSize: '.875rem', fontWeight: 500,
    color: isActive ? '#fff' : 'rgba(255,255,255,.7)',
    background: isActive ? 'rgba(255,255,255,.15)' : 'transparent',
    transition: 'background .15s, color .15s', textDecoration: 'none',
  })

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside style={{ width: 'var(--sidebar-w)', minHeight: '100vh', background: 'var(--green-900)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 100 }}>
      <div style={{ padding: '1.1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,.12)', marginBottom: '.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💊</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', letterSpacing: '.03em' }}>MediTrace</div>
            <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.55)' }}>Admin Portal</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, overflowY: 'auto', paddingTop: '.25rem' }}>
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to.split('/').length <= 2} style={linkStyle}>
            <span style={{ fontSize: '1rem' }}>{icon}</span>{label}
          </NavLink>
        ))}
      </nav>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', padding: '1rem' }}>
        <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.5)', marginBottom: '.6rem' }}>Signed in as</div>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: '.875rem', marginBottom: '.1rem' }}>{user?.username}</div>
        <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.75rem', marginBottom: '.75rem', textTransform: 'capitalize' }}>{user?.role}</div>
        <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.85)', borderRadius: 8, padding: '.5rem', fontSize: '.8rem', fontWeight: 600 }}>Sign out</button>
      </div>
    </aside>
  )
}