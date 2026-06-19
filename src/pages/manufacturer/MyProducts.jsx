import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import Badge from '../../components/Badge'
import client from '../../api/client'

export default function MyProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    client.get('/products/mine')
      .then(r => setProducts(r.data?.data || r.data?.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="page-header">
        <div><h1>My Products</h1><p>All products you have registered</p></div>
        <button className="btn-primary" onClick={() => navigate('/manufacturer/register')}>+ Register Product</button>
      </div>
      <div className="card">
        {loading ? <div className="spinner" /> : products.length === 0 ? (
          <p className="empty">No products yet. <span style={{ color: 'var(--green-800)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/manufacturer/register')}>Register your first product →</span></p>
        ) : (
          <div className="table-wrap"><table>
            <thead><tr><th>Product</th><th>Ingredient</th><th>Form</th><th>Strength</th><th>PPB Reg No.</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{products.map(p => (
              <tr key={p.product_id}>
                <td style={{ fontWeight: 600 }}>{p.product_name}</td>
                <td>{p.active_ingredient}</td>
                <td>{p.dosage_form}</td>
                <td>{p.strength}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '.8rem' }}>{p.ppb_reg_number}</td>
                <td><Badge value={p.status} /></td>
                <td>{p.status === 'approved' && (
                  <button className="btn-secondary btn-sm" onClick={() => navigate(`/manufacturer/batches?product=${p.product_id}&name=${encodeURIComponent(p.product_name)}`)}>Manage Batches</button>
                )}</td>
              </tr>))}
            </tbody>
          </table></div>
        )}
      </div>
    </Layout>
  )
}