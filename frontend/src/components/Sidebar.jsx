import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Zap, ShieldCheck, X } from 'lucide-react'

export default function Sidebar({ open, setOpen }) {
  if (!open) return null

  const linkStyle = ({ isActive }) => ({
    display        : 'flex',
    alignItems     : 'center',
    gap            : '10px',
    padding        : '10px 16px',
    borderRadius   : '10px',
    textDecoration : 'none',
    fontSize       : '14px',
    fontWeight     : '500',
    color          : isActive ? '#ffffff' : '#64748b',
    background     : isActive ? '#2563eb' : 'transparent',
    transition     : 'all 0.2s',
  })

  return (
    <div style={{
      position   : 'fixed',
      left       : 0,
      top        : 0,
      bottom     : 0,
      width      : '240px',
      background : '#ffffff',
      borderRight: '1px solid #e2e8f0',
      boxShadow  : '2px 0 8px rgba(0,0,0,0.06)',
      zIndex     : 100,
      display    : 'flex',
      flexDirection : 'column',
      padding    : '0 12px 24px',
    }}>

      {/* Logo */}
      <div style={{
        padding        : '20px 8px 16px',
        borderBottom   : '1px solid #f1f5f9',
        marginBottom   : '12px',
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background   : '#2563eb',
            borderRadius : '10px',
            padding      : '7px',
            display      : 'flex',
          }}>
            <ShieldCheck size={18} color="white" />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              FraudGuard
            </p>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              AI Detection
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <p style={{ fontSize: '11px', fontWeight: '600', color: '#cbd5e1', padding: '0 8px', marginBottom: '6px', letterSpacing: '0.06em' }}>
        MENU
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavLink to="/"        style={linkStyle} end>
          <LayoutDashboard size={17} /> Dashboard
        </NavLink>
        <NavLink to="/predict" style={linkStyle}>
          <Zap size={17} /> Predict
        </NavLink>
      </nav>

      {/* Bottom badge */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{
          background   : '#eff6ff',
          border       : '1px solid #bfdbfe',
          borderRadius : '10px',
          padding      : '12px',
        }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#1d4ed8', margin: '0 0 3px' }}>
            IEEE-CIS Dataset
          </p>
          <p style={{ fontSize: '11px', color: '#60a5fa', margin: 0 }}>
            590K transactions
          </p>
        </div>
      </div>
    </div>
  )
}