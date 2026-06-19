import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'
import { useAuth } from '../../context/AuthContext'
import client from '../../api/client'

export default function MfgDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      client.get('/products/mine').catch(() => ({ data: { data: [] } })),
      client.get('/batches/mine').catch(() => ({ data: { data: [] } })),
    ]).then(([prod, batch]) => {
      const products = prod.data?.data || prod.data?.products || []
      const batches = batch.data?.data || batch.data?.batches || []
      setData({
        totalProducts: products.length,
        approvedProducts: products.filter(p => p.status === 'approved').length,
        pendingProducts: products.filter(p => p.status === 'pending').length,
        totalBatches: batches.length,
        recentProducts: products.slice(0, 5),
      })
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Layout><div className="spinner" /></Layout>

  return (
    <Layout>
      <div className="page-header">
        <div><h1>Welcome, {user?.username}</h1><p>{user?.facility_name || 'Manufacturer Portal'}</p></div>
        <button className="btn-primary" onClick={() => navigate('/manufacturer/register')}>+ Register Product</button>
      </div>
      {user?.verification_status !== 'approved' && (
        <div className="error-msg" style={{ marginBottom: '1.4rem' }}>
          Your account is awaiting administrator approval. You cannot register products until approved.
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '1rem', marginBottom: '1.8rem' }}>
        <StatCard label="Total products" value={data?.totalProducts} icon="💊" accent="#d8f3dc" />
        <StatCard label="Approved" value={data?.approvedProducts} icon="✅" accent="#d8f3dc" />
        <StatCard label="Pending review" value={data?.pendingProducts} icon="⏳" accent="#fef3c7" />
        <StatCard label="Total batches" value={data?.totalBatches} icon="📦" accent="#dbeafe" />
      </div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>My Products</h2>
          <button className="btn-secondary btn-sm" onClick={() => navigate('/manufacturer/products')}>View all</button>
        </div>
        {data?.recentProducts?.length === 0 ? (
          <p className="empty">No products registered yet. <span style={{ color: 'var(--green-800)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/manufacturer/register')}>Register your first product →</span></p>
        ) : (
          <table>
            <thead><tr><th>Product</th><th>Ingredient</th><th>Strength</th><th>PPB No.</th><th>Status</th></tr></thead>
            <tbody>{data.recentProducts.map(p => (
              <tr key={p.product_id}>
                <td style={{ fontWeight: 600 }}>{p.product_name}</td>
                <td>{p.active_ingredient}</td>
                <td>{p.strength}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '.8rem' }}>{p.ppb_reg_number}</td>
                <td><Badge value={p.status} /></td>
              </tr>))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}