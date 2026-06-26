import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Badge from '../../components/Badge'
import client from '../../api/client'

export default function ScanLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    client.get('/scan-logs')
      .then(r => setLogs(r.data?.data || r.data?.logs || []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? logs : logs.filter(l => l.scan_result === filter)
  const counts = ['valid','invalid','expired','counterfeit'].reduce((a, k) => { a[k] = logs.filter(l => l.scan_result === k).length; return a }, {})

  return (
    <Layout>
      <div className="page-header"><div><h1>Scan Logs</h1><p>All QR code verification events</p></div></div>
      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
        {[['all', logs.length, '#f3f4f6', '#374151'], ['valid', counts.valid, '#d8f3dc', '#1b4332'], ['expired', counts.expired, '#fef3c7', '#92400e'], ['counterfeit', counts.counterfeit, '#fee2e2', '#991b1b'], ['invalid', counts.invalid, '#ede9fe', '#5b21b6']].map(([key, count, bg, color]) => (
          <button key={key} onClick={() => setFilter(key)} style={{ background: filter === key ? color : bg, color: filter === key ? '#fff' : color, border: 'none', borderRadius: 20, padding: '.4rem 1rem', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{key} ({count})</button>
        ))}
      </div>
      <div className="card">
        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <p className="empty">No scan logs found.</p>
        ) : (
          <div className="table-wrap"><table>
            <thead><tr><th>Result</th><th>Batch ID</th><th>Scanned By</th><th>Location</th><th>IP Address</th><th>Time</th></tr></thead>
            <tbody>{filtered.map(l => (
              <tr key={l.log_id}>
                <td><Badge value={l.scan_result} /></td>
                <td style={{ fontFamily: 'monospace', fontSize: '.75rem' }}>{l.batch_id ? l.batch_id.slice(0, 8) + '…' : '-'}</td>
                <td>{l.scanned_by || 'Anonymous'}</td>
                <td>{l.location || '-'}</td>
                <td style={{ fontSize: '.8rem', color: 'var(--grey-500)' }}>{l.ip_address || '—'}</td>
                <td style={{ fontSize: '.8rem', color: 'var(--grey-500)', whiteSpace: 'nowrap' }}>{new Date(l.scanned_at).toLocaleString()}</td>
              </tr>))}
            </tbody>
          </table></div>
        )}
      </div>
    </Layout>
  )
}