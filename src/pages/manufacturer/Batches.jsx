import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import Badge from '../../components/Badge'
import client from '../../api/client'

export default function Batches() {
  const [params] = useSearchParams()
  const productId = params.get('product')
  const productName = params.get('name') || 'Product'

  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrModal, setQrModal] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [acting, setActing] = useState(null)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ batch_number: '', manufacturing_date: '', expiry_date: '', quantity: '', retailer: '', store_location: '' })

  const load = () => {
    if (!productId) return setLoading(false)
    client.get(`/batches?product_id=${productId}`)
      .then(r => setBatches(r.data?.data || r.data?.batches || []))
      .catch(() => setBatches([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [productId])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const createBatch = async (e) => {
    e.preventDefault(); setMsg(''); setActing('create')
    try {
      await client.post('/batches', { ...form, product_id: productId, quantity: Number(form.quantity) })
      setMsg('Batch created successfully.'); setShowForm(false)
      setForm({ batch_number: '', manufacturing_date: '', expiry_date: '', quantity: '', retailer: '', store_location: '' })
      load()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to create batch.')
    } finally { setActing(null) }
  }

  const generateQR = async (batchId) => {
    setActing(batchId); setMsg('')
    try {
      const r = await client.post(`/batches/${batchId}/generate-qr`)
      const url = r.data?.data?.qr_image_url || r.data?.qr_url || r.data?.data?.encoded_url
      setQrModal({ batchId, qrUrl: url }); load()
    } catch (err) {
      setMsg(err.response?.data?.message || 'QR generation failed.')
    } finally { setActing(null) }
  }

  return (
    <Layout>
      <div className="page-header">
        <div><h1>Batches & QR Codes</h1><p>{decodeURIComponent(productName)}</p></div>
        {productId && <button className="btn-primary" onClick={() => setShowForm(s => !s)}>{showForm ? 'Cancel' : '+ Add Batch'}</button>}
      </div>
      {!productId && <div className="card"><p className="empty">Select a product from <a href="/manufacturer/products" style={{ color: 'var(--green-800)', fontWeight: 600 }}>My Products</a> to manage its batches.</p></div>}
      {msg && <div className="success-msg">{msg}</div>}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.4rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>New Batch</h2>
          <form onSubmit={createBatch}>
            <div className="form-row">
              <div className="form-group"><label>Batch Number *</label><input value={form.batch_number} onChange={e => set('batch_number', e.target.value)} placeholder="e.g. AMX-2025-004" required /></div>
              <div className="form-group"><label>Quantity *</label><input type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="e.g. 1000" required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Manufacturing Date *</label><input type="date" value={form.manufacturing_date} onChange={e => set('manufacturing_date', e.target.value)} required /></div>
              <div className="form-group"><label>Expiry Date *</label><input type="date" value={form.expiry_date} onChange={e => set('expiry_date', e.target.value)} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Retailer / Pharmacy</label><input value={form.retailer} onChange={e => set('retailer', e.target.value)} placeholder="e.g. Good Life Pharmacy" /></div>
              <div className="form-group"><label>Store Location</label><input value={form.store_location} onChange={e => set('store_location', e.target.value)} placeholder="e.g. Westlands, Nairobi" /></div>
            </div>
            <button type="submit" className="btn-primary" disabled={acting === 'create'} style={{ padding: '.65rem 1.5rem' }}>{acting === 'create' ? 'Creating…' : 'Create Batch'}</button>
          </form>
        </div>
      )}
      {productId && (
        <div className="card">
          {loading ? <div className="spinner" /> : batches.length === 0 ? (
            <p className="empty">No batches yet. Add your first batch above.</p>
          ) : (
            <div className="table-wrap"><table>
              <thead><tr><th>Batch No.</th><th>Mfg Date</th><th>Expiry</th><th>Qty</th><th>Retailer</th><th>Location</th><th>Status</th><th>QR Code</th></tr></thead>
              <tbody>{batches.map(b => (
                <tr key={b.batch_id}>
                  <td style={{ fontWeight: 600 }}>{b.batch_number}</td>
                  <td>{b.manufacturing_date?.slice(0,10)}</td>
                  <td>{b.expiry_date?.slice(0,10)}</td>
                  <td>{b.quantity?.toLocaleString()}</td>
                  <td>{b.retailer || '—'}</td>
                  <td>{b.store_location || '—'}</td>
                  <td><Badge value={b.status} /></td>
                  <td>{b.has_qr ? (
                    <button className="btn-secondary btn-sm" onClick={() => setQrModal({ batchId: b.batch_id, qrUrl: b.qr_url })}>View QR</button>
                  ) : (
                    <button className="btn-primary btn-sm" disabled={b.status !== 'approved' || acting === b.batch_id} onClick={() => generateQR(b.batch_id)}>{acting === b.batch_id ? 'Generating…' : 'Generate QR'}</button>
                  )}</td>
                </tr>))}
              </tbody>
            </table></div>
          )}
        </div>
      )}
      {qrModal && (
        <div onClick={() => setQrModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: '2rem', maxWidth: 400, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,.3)', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '.5rem' }}>QR Code</h2>
            <p style={{ fontSize: '.85rem', color: 'var(--grey-500)', marginBottom: '1.25rem' }}>Print and attach to the antibiotic packaging.</p>
            {qrModal.qrUrl ? (
              <img src={qrModal.qrUrl} alt="QR Code" style={{ width: 240, height: 240, borderRadius: 8 }} />
            ) : (
              <p style={{ color: 'var(--grey-500)' }}>QR code generated. Check the <code>qrcodes/</code> folder on the server.</p>
            )}
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
              {qrModal.qrUrl && <a href={qrModal.qrUrl} download><button className="btn-primary">Download</button></a>}
              <button className="btn-secondary" onClick={() => setQrModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}