import { Menu } from 'lucide-react'

export default function TopBar({ title, subtitle, sidebarOpen, setSidebarOpen }) {
  return (
    <div style={{
      background    : '#ffffff',
      borderBottom  : '1px solid #e2e8f0',
      padding       : '14px 24px',
      display       : 'flex',
      alignItems    : 'center',
      gap           : '14px',
      boxShadow     : '0 1px 3px rgba(0,0,0,0.04)',
      position      : 'sticky',
      top           : 0,
      zIndex        : 50,
    }}>
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            background   : '#f1f5f9',
            border       : '1px solid #e2e8f0',
            borderRadius : '8px',
            padding      : '7px',
            cursor       : 'pointer',
            display      : 'flex',
            color        : '#475569',
          }}
        >
          <Menu size={17} />
        </button>
      )}
      <div>
        <h1 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{subtitle}</p>
        )}
      </div>
      {/* Status pill */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>API Online</span>
      </div>
    </div>
  )
}