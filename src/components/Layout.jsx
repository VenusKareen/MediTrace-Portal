import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, padding: '2rem', minHeight: '100vh', background: 'var(--green-50)' }}>
        {children}
      </main>
    </div>
  )
}