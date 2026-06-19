const colours = {
  approved: { bg: '#d8f3dc', color: '#1b4332' },
  pending: { bg: '#fef3c7', color: '#92400e' },
  rejected: { bg: '#fee2e2', color: '#991b1b' },
  valid: { bg: '#d8f3dc', color: '#1b4332' },
  expired: { bg: '#fef3c7', color: '#92400e' },
  counterfeit: { bg: '#fee2e2', color: '#991b1b' },
  invalid: { bg: '#fee2e2', color: '#991b1b' },
  open: { bg: '#fef3c7', color: '#92400e' },
  investigating: { bg: '#dbeafe', color: '#1e40af' },
  resolved: { bg: '#d8f3dc', color: '#1b4332' },
  admin: { bg: '#ede9fe', color: '#5b21b6' },
  manufacturer: { bg: '#dbeafe', color: '#1e40af' },
  pharmacist: { bg: '#d8f3dc', color: '#1b4332' },
  consumer: { bg: '#f3f4f6', color: '#374151' },
}

export default function Badge({ value }) {
  const style = colours[(value || '').toLowerCase()] || { bg: '#f3f4f6', color: '#374151' }
  return (
    <span style={{ background: style.bg, color: style.color, padding: '3px 10px', borderRadius: 20, fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
      {value}
    </span>
  )
}