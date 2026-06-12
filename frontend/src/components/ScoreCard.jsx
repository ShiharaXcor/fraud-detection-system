export default function ScoreCard({ result }) {
  if (!result) return null

  const { fraud_probability, fraud_predicted, risk_level, threshold_used } = result
  const pct = (fraud_probability * 100).toFixed(1)

  const riskConfig = {
    Low    : { color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0' },
    Medium : { color: '#d97706', bg: '#fef9c3', border: '#fde68a' },
    High   : { color: '#dc2626', bg: '#fee2e2', border: '#fecaca' },
  }
  const rc = riskConfig[risk_level] || riskConfig.Low

  return (
    <div style={{
      background   : '#ffffff',
      border       : `1px solid ${rc.border}`,
      borderRadius : '14px',
      padding      : '24px',
      boxShadow    : '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <p style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', margin: '0 0 18px' }}>
        Prediction Result
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Circular score */}
        <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="38" fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <circle
              cx="45" cy="45" r="38"
              fill="none"
              stroke={rc.color}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 38 * fraud_probability} ${2 * Math.PI * 38}`}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
            />
          </svg>
          <div style={{
            position      : 'absolute', inset: 0,
            display       : 'flex', flexDirection: 'column',
            alignItems    : 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: rc.color }}>{pct}%</span>
          </div>
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 4px' }}>Risk Level</p>
            <span style={{
              background   : rc.bg,
              color        : rc.color,
              border       : `1px solid ${rc.border}`,
              borderRadius : '999px',
              padding      : '3px 12px',
              fontSize     : '13px',
              fontWeight   : '600',
            }}>
              {risk_level} Risk
            </span>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 4px' }}>Decision</p>
            <span style={{
              background   : fraud_predicted ? '#fee2e2' : '#dcfce7',
              color        : fraud_predicted ? '#dc2626' : '#16a34a',
              borderRadius : '999px',
              padding      : '3px 12px',
              fontSize     : '13px',
              fontWeight   : '600',
            }}>
              {fraud_predicted ? 'Fraud Detected' : 'Legitimate'}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0 }}>
            Threshold: {threshold_used}
          </p>
        </div>
      </div>
    </div>
  )
}