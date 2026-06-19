import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import StatCard from '../../components/StatCard'
import client from '../../api/client'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      client.get('/users').catch(() => ({ data: { data: [] } })),
      client.get('/products').catch(() => ({ data: { data: [] } })),
      client.get('/scan-logs').catch(() => ({ data: { data: [] } })),
      client.get('/reports').catch(() => ({ data: { data: [] } })),
    ]).then(([users, products, logs, reports]) => {
      const u = users.data?.data || users.data?.users || []
      const p = products.data?.data || products.data?.products || []
      const l = logs.data?.data || logs.data?.logs || []
      const r = reports.data?.data || reports.data?.reports || []
      setStats({
        pendingUsers: u.filter(x => x.verification_status === 'pending').length,
        totalProducts: p.length,
        totalScans: l.length,
        openReports: r.filter(x => x.status === 'open').length,
        recentScans: l.slice(0, 5),
        recentReports: r.slice(0, 5),
      })
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Layout><div className="spinner" /></Layout>

  return (
    <Layout>
      <div className="page-header">
        <div><h1>Dashboard</h1><p>MediTrace system overview</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '1rem', marginBottom: '1.8rem' }}>
        <StatCard label="Pending approvals" value={stats?.pendingUsers} icon="👥" accent="#fef3c7" />
        <StatCard label="Total products" value={stats?.totalProducts} icon="💊" accent="#d8f3dc" />
        <StatCard label="Scans logged" value={stats?.totalScans} icon="📋" accent="#dbeafe" />
        <StatCard label="Open reports" value={stats?.openReports} icon="🚨" accent="#fee2e2" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Scans</h2>
            <button className="btn-secondary btn-sm" onClick={() => navigate('/admin/scanlogs')}>View all</button>
          </div>
          {stats?.recentScans?.length ? (
            <table><thead><tr><th>Result</th><th>Location</th><th>Time</th></tr></thead>
              <tbody>{stats.recentScans.map(s => (
                <tr key={s.log_id}>
                  <td><span style={{ textTransform: 'capitalize', fontWeight: 600, color: s.scan_result === 'valid' ? 'var(--green-800)' : 'var(--red-600)' }}>{s.scan_result}</span></td>
                  <td>{s.location || '—'}</td>
                  <td style={{ fontSize: '.75rem', color: 'var(--grey-500)' }}>{new Date(s.scanned_at).toLocaleString()}</td>
                </tr>))}
              </tbody>
            </table>
          ) : <p className="empty">No scans recorded yet.</p>}
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Reports</h2>
            <button className="btn-secondary btn-sm" onClick={() => navigate('/admin/reports')}>View all</button>
          </div>
          {stats?.recentReports?.length ? (
            <table><thead><tr><th>Medication</th><th>Location</th><th>Status</th></tr></thead>
              <tbody>{stats.recentReports.map(r => (
                <tr key={r.report_id}>
                  <td>{r.medication_name || '—'}</td>
                  <td>{r.location || '—'}</td>
                  <td style={{ textTransform: 'capitalize', fontWeight: 600, color: r.status === 'open' ? 'var(--amber-600)' : 'var(--green-800)' }}>{r.status}</td>
                </tr>))}
              </tbody>
            </table>
          ) : <p className="empty">No reports submitted yet.</p>}
        </div>
      </div>
    </Layout>
  )
}