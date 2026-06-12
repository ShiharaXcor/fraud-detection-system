export default function StatCard({ label, value, sub, icon, iconBg, iconColor }) {
  return (
    <div style={{
      background   : '#ffffff',
      border       : '1px solid #e2e8f0',
      borderRadius : '14px',
      padding      : '18px 20px',
      boxShadow    : '0 1px 4px rgba(0,0,0,0.05)',
      display      : 'flex',
      alignItems   : 'flex-start',
      gap          : '14px',
    }}>
      <div style={{
        background   : iconBg,
        borderRadius : '10px',
        padding      : '10px',
        flexShrink   : 0,
        fontSize     : '20px',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', margin: '0 0 4px' }}>
          {label}
        </p>
        <p style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px' }}>
          {value}
        </p>
        {sub && (
          <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0 }}>{sub}</p>
        )}
      </div>
    </div>
  )
}