import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from 'recharts'

export default function ShapChart({ features }) {
  if (!features || features.length === 0) return null

  const data = features
    .slice(0, 10)
    .map(f => ({
      name  : f.feature.length > 13 ? f.feature.slice(0, 13) + '…' : f.feature,
      value : parseFloat(f.shap_value.toFixed(4)),
      raw   : f.value,
    }))
    .sort((a, b) => a.value - b.value)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={{
        background   : '#ffffff',
        border       : '1px solid #e2e8f0',
        borderRadius : '8px',
        padding      : '10px 14px',
        fontSize     : '12px',
        boxShadow    : '0 4px 12px rgba(0,0,0,0.08)',
      }}>
        <p style={{ fontWeight: '600', color: '#0f172a', margin: '0 0 4px' }}>{d.name}</p>
        <p style={{ color: d.value > 0 ? '#dc2626' : '#2563eb', margin: '0 0 2px' }}>
          SHAP: {d.value > 0 ? '+' : ''}{d.value}
        </p>
        <p style={{ color: '#94a3b8', margin: 0 }}>Value: {d.raw}</p>
      </div>
    )
  }

  return (
    <div style={{
      background   : '#ffffff',
      border       : '1px solid #e2e8f0',
      borderRadius : '14px',
      padding      : '20px',
      boxShadow    : '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px' }}>
        SHAP Feature Explanation
      </p>
      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>
        Red = increases fraud risk · Blue = decreases risk
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} width={85} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <ReferenceLine x={0} stroke="#e2e8f0" strokeWidth={1.5} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.value > 0 ? '#ef4444' : '#2563eb'} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}