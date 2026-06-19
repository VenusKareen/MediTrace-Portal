import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Badge from '../../components/Badge'
import client from '../../api/client'

export default function PendingUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    client.get('/users')
      .then(r => setUsers(r.data?.data || r.data?.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const act = async (userId, status) => {
    setActing(userId + status); setMsg('')
    try {
      await client.patch(`/users/${userId}/verify`, { status })
      setMsg(`User ${status} successfully.`); load()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Action failed.')
    } finally { setActing(null) }
  }

  const pending = users.filter(u => u.verification_status === 'pending')
  const others = users.filter(u => u.verification_status !== 'pending')

  return (
    <Layout>
      <div className="page-header"><div><h1>User Approvals</h1><p>Review and approve manufacturer and pharmacist registrations</p></div></div>
      {msg && <div className="success-msg">{msg}</div>}
      <div className="card" style={{ marginBottom: '1.4rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Awaiting Approval {pending.length > 0 && <span style={{ marginLeft: '.5rem', background: 'var(--amber-100)', color: 'var(--amber-600)', borderRadius: 12, padding: '2px 10px', fontSize: '.75rem' }}>{pending.length}</span>}
        </h2>
        {loading ? <div className="spinner" /> : pending.length === 0 ? (
          <p className="empty">No pending registrations — you're all caught up.</p>
        ) : (
          <div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Licence / Facility</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>{pending.map(u => (
              <tr key={u.user_id}>
                <td style={{ fontWeight: 600 }}>{u.username}</td>
                <td>{u.email}</td>
                <td><Badge value={u.role} /></td>
                <td><div style={{ fontSize: '.8rem' }}>{u.facility_name || '—'}</div><div style={{ fontSize: '.75rem', color: 'var(--grey-500)' }}>{u.license_number || ''}</div></td>
                <td style={{ fontSize: '.8rem', color: 'var(--grey-500)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                <td><div style={{ display: 'flex', gap: '.5rem' }}>
                  <button className="btn-primary btn-sm" disabled={!!acting} onClick={() => act(u.user_id, 'approved')}>{acting === u.user_id + 'approved' ? '…' : 'Approve'}</button>
                  <button className="btn-danger btn-sm" disabled={!!acting} onClick={() => act(u.user_id, 'rejected')}>{acting === u.user_id + 'rejected' ? '…' : 'Reject'}</button>
                </div></td>
              </tr>))}
            </tbody>
          </table></div>
        )}
      </div>
      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>All Users</h2>
        {loading ? <div className="spinner" /> : others.length === 0 ? (
          <p className="empty">No approved or rejected users yet.</p>
        ) : (
          <div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Facility</th></tr></thead>
            <tbody>{others.map(u => (
              <tr key={u.user_id}>
                <td style={{ fontWeight: 600 }}>{u.username}</td>
                <td>{u.email}</td>
                <td><Badge value={u.role} /></td>
                <td><Badge value={u.verification_status} /></td>
                <td>{u.facility_name || '—'}</td>
              </tr>))}
            </tbody>
          </table></div>
        )}
      </div>
    </Layout>
  )
}