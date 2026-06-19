import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import client from '../../api/client'

const DOSAGE_FORMS = ['Capsule','Tablet','Syrup','Injection','Cream','Ointment','Drops','Suspension','Powder']

export default function RegisterProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    product_name: '', active_ingredient: '', dosage_form: 'Tablet',
    strength: '', ppb_reg_number: '', manufacturer_name: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      await client.post('/products', form)
      setSuccess('Product registered successfully. Awaiting admin approval.')
      setTimeout(() => navigate('/manufacturer/products'), 1800)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <Layout>
      <div className="page-header">
        <div><h1>Register Product</h1><p>Submit a new antibiotic product for PPB approval</p></div>
        <button className="btn-secondary" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <div style={{ maxWidth: 640 }}>
        <div className="card">
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Product Name *</label>
              <input value={form.product_name} onChange={e => set('product_name', e.target.value)} placeholder="e.g. Amoxicillin 500mg Capsules" required />
            </div>
            <div className="form-row">
              <div className="form-group"><label>Active Ingredient *</label><input value={form.active_ingredient} onChange={e => set('active_ingredient', e.target.value)} placeholder="e.g. Amoxicillin Trihydrate" required /></div>
              <div className="form-group"><label>Strength *</label><input value={form.strength} onChange={e => set('strength', e.target.value)} placeholder="e.g. 500mg" required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Dosage Form *</label><select value={form.dosage_form} onChange={e => set('dosage_form', e.target.value)}>{DOSAGE_FORMS.map(f => <option key={f}>{f}</option>)}</select></div>
              <div className="form-group"><label>PPB Registration Number *</label><input value={form.ppb_reg_number} onChange={e => set('ppb_reg_number', e.target.value)} placeholder="e.g. PPB/2024/AMX/00147" required /></div>
            </div>
            <div className="form-group">
              <label>Manufacturer Name *</label>
              <input value={form.manufacturer_name} onChange={e => set('manufacturer_name', e.target.value)} placeholder="Legal company name as registered with PPB" required />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '.5rem' }}>
              <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, padding: '.7rem' }}>{loading ? 'Submitting…' : 'Submit for Approval'}</button>
              <button type="button" className="btn-secondary" onClick={() => navigate(-1)} style={{ flex: 1, padding: '.7rem' }}>Cancel</button>
            </div>
          </form>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '.8rem', color: 'var(--grey-500)', lineHeight: 1.6 }}>
          Products are reviewed by the Pharmacy and Poisons Board (PPB) administrator before being activated. You will be notified once your product is approved and can then register batches and generate QR codes.
        </p>
      </div>
    </Layout>
  )
}