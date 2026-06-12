export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) return (
    <div style={{
      background   : '#ffffff',
      border       : '1px solid #e2e8f0',
      borderRadius : '14px',
      padding      : '40px',
      textAlign    : 'center',
      boxShadow    : '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
        No transactions scored yet — go to Predict to score one.
      </p>
    </div>
  )

  const riskConfig = {
    Low    : { color: '#16a34a', bg: '#dcfce7' },
    Medium : { color: '#d97706', bg: '#fef9c3' },
    High   : { color: '#dc2626', bg: '#fee2e2' },
  }

  return (
    <div style={{
      background   : '#ffffff',
      border       : '1px solid #e2e8f0',
      borderRadius : '14px',
      overflow     : 'hidden',
      boxShadow    : '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['#', 'Amount', 'Probability', 'Risk', 'Decision', 'Time'].map(h => (
              <th key={h} style={{
                padding    : '12px 16px',
                textAlign  : 'left',
                fontSize   : '11px',
                fontWeight : '600',
                color      : '#94a3b8',
                letterSpacing : '0.04em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => {
            const rc = riskConfig[t.risk_level] || riskConfig.Low
            return (
              <tr key={i} style={{
                borderBottom : i < transactions.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition   : 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', color: '#cbd5e1', fontWeight: '500' }}>{i + 1}</td>
                <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a' }}>
                  ${t.amount?.toFixed(2) || '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '56px', height: '4px', borderRadius: '99px', background: '#f1f5f9' }}>
                      <div style={{
                        width      : `${t.fraud_probability * 100}%`,
                        height     : '100%',
                        borderRadius : '99px',
                        background : rc.color,
                      }} />
                    </div>
                    <span style={{ color: '#475569', fontWeight: '500' }}>
                      {(t.fraud_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background   : rc.bg,
                    color        : rc.color,
                    borderRadius : '999px',
                    padding      : '3px 10px',
                    fontSize     : '11px',
                    fontWeight   : '600',
                  }}>{t.risk_level}</span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: '600',
                  color: t.fraud_predicted ? '#dc2626' : '#16a34a' }}>
                  {t.fraud_predicted ? 'Fraud' : 'Legitimate'}
                </td>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '12px' }}>
                  {t.time || '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}