import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Badge from '../../components/Badge'
import client from '../../api/client'

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    client.get('/reports')
      .then(r => setReports(r.data?.data || r.data?.reports || []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const updateStatus = async (id, status) => {
    setActing(id)
    try {
      await client.patch(`/reports/${id}/status`, { status })
      setMsg(`Report marked as ${status}.`); load()
    } catch { setMsg('Update failed.') } finally { setActing(null) }
  }

  return (
    <Layout>
      <div className="page-header"><div><h1>Counterfeit Reports</h1><p>Reports submitted by pharmacists and consumers via the mobile app</p></div></div>
      {msg && <div className="success-msg">{msg}</div>}
      <div className="card">
        {loading ? <div className="spinner" /> : reports.length === 0 ? (
          <p className="empty">No reports submitted yet.</p>
        ) : (
          <div className="table-wrap"><table>
            <thead><tr><th>Medication</th><th>Pharmacy</th><th>Location</th><th>Description</th><th>Status</th><th>Reported</th><th>Actions</th></tr></thead>
            <tbody>{reports.map(r => (
              <tr key={r.report_id}>
                <td style={{ fontWeight: 600 }}>{r.medication_name || '-'}</td>
                <td>{r.pharmacy_name || '-'}</td>
                <td>{r.location || '-'}</td>
                <td style={{ maxWidth: 220, fontSize: '.8rem', color: 'var(--grey-700)' }}>{r.description ? r.description.slice(0, 80) + (r.description.length > 80 ? '…' : '') : '—'}</td>
                <td><Badge value={r.status} /></td>
                <td style={{ fontSize: '.8rem', color: 'var(--grey-500)', whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                <td>
                  {r.status === 'open' && <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button className="btn-secondary btn-sm" disabled={acting === r.report_id} onClick={() => updateStatus(r.report_id, 'investigating')}>Investigate</button>
                    <button className="btn-primary btn-sm" disabled={acting === r.report_id} onClick={() => updateStatus(r.report_id, 'resolved')}>Resolve</button>
                  </div>}
                  {r.status === 'investigating' && <button className="btn-primary btn-sm" disabled={acting === r.report_id} onClick={() => updateStatus(r.report_id, 'resolved')}>Mark resolved</button>}
                  {r.status === 'resolved' && <span style={{ fontSize: '.8rem', color: 'var(--grey-400)' }}>Closed</span>}
                </td>
              </tr>))}
            </tbody>
          </table></div>
        )}
      </div>
    </Layout>
  )
}