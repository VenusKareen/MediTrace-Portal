import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Badge from '../../components/Badge'
import client from '../../api/client'

export default function AllProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(null)
  const [msg, setMsg] = useState('')
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)
    client.get('/products')
      .then(r => setProducts(r.data?.data || r.data?.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const act = async (productId, status) => {
    setActing(productId + status); setMsg('')
    try {
      await client.patch(`/products/${productId}/status`, { status })
      setMsg(`Product ${status}.`); load()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Action failed.')
    } finally { setActing(null) }
  }

  const filtered = filter === 'all' ? products : products.filter(p => p.status === filter)

  return (
    <Layout>
      <div className="page-header">
        <div><h1>Products</h1><p>Review and approve antibiotic product registrations</p></div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          {['all','pending','approved','rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? 'var(--green-800)' : 'var(--white)', color: filter === f ? '#fff' : 'var(--grey-700)', border: '1.5px solid', borderColor: filter === f ? 'var(--green-800)' : 'var(--grey-300)', borderRadius: 8, padding: '.4rem .9rem', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>
      {msg && <div className="success-msg">{msg}</div>}
      <div className="card">
        {loading ? <div className="spinner" /> : filtered.length === 0 ? (
          <p className="empty">No products found.</p>
        ) : (
          <div className="table-wrap"><table>
            <thead><tr><th>Product</th><th>Ingredient</th><th>Strength</th><th>Manufacturer</th><th>PPB Reg No.</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map(p => (
              <tr key={p.product_id}>
                <td><div style={{ fontWeight: 600 }}>{p.product_name}</div><div style={{ fontSize: '.75rem', color: 'var(--grey-500)' }}>{p.dosage_form}</div></td>
                <td>{p.active_ingredient}</td>
                <td>{p.strength}</td>
                <td>{p.manufacturer_name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '.8rem' }}>{p.ppb_reg_number}</td>
                <td><Badge value={p.status} /></td>
                <td>{p.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button className="btn-primary btn-sm" disabled={!!acting} onClick={() => act(p.product_id, 'approved')}>{acting === p.product_id + 'approved' ? '…' : 'Approve'}</button>
                    <button className="btn-danger btn-sm" disabled={!!acting} onClick={() => act(p.product_id, 'rejected')}>{acting === p.product_id + 'rejected' ? '…' : 'Reject'}</button>
                  </div>
                ) : <span style={{ fontSize: '.8rem', color: 'var(--grey-400)' }}>—</span>}</td>
              </tr>))}
            </tbody>
          </table></div>
        )}
      </div>
    </Layout>
  )
}