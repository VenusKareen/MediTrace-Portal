export default function StatCard({ label, value, icon, accent }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.09)', padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: accent || '#d8f3dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, lineHeight: 1.1 }}>{value ?? '—'}</div>
        <div style={{ fontSize: '.8rem', color: '#6b7280', marginTop: '.2rem' }}>{label}</div>
      </div>
    </div>
  )
}