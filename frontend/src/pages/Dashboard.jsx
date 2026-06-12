import { useEffect, useState } from 'react'
import axios from 'axios'
import TopBar            from '../components/TopBar'
import StatCard          from '../components/StatCard'
import TransactionTable  from '../components/TransactionTable'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid
} from 'recharts'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Dashboard({ sidebarOpen, setSidebarOpen }) {
  const [metrics,      setMetrics]      = useState(null)
  const [features,     setFeatures]     = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('fraud_transactions')
    if (saved) setTransactions(JSON.parse(saved))

    Promise.all([
      axios.get(`${API}/metrics`),
      axios.get(`${API}/features`),
    ])
      .then(([m, f]) => {
        setMetrics(m.data)
        const feat = f.data.top_features
        const arr  = Object.entries(feat)
          .map(([name, val]) => ({
            name  : name.length > 10 ? name.slice(0, 10) + '…' : name,
            value : parseFloat(val.toFixed(4))
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10)
        setFeatures(arr)
      })
      .catch(() => setError('Cannot connect to API. Start FastAPI on port 8000.'))
      .finally(() => setLoading(false))
  }, [])

  const COLORS = [
    '#2563eb','#3b82f6','#60a5fa','#93c5fd',
    '#bfdbfe','#1d4ed8','#1e40af','#1e3a8a','#172554','#dbeafe'
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{
        background:'#fff', border:'1px solid #e2e8f0',
        borderRadius:'8px', padding:'10px 14px',
        fontSize:'12px', boxShadow:'0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <p style={{ fontWeight:'600', color:'#0f172a', margin:'0 0 3px' }}>{label}</p>
        <p style={{ color:'#2563eb', margin:0 }}>Score: {payload[0].value}</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <TopBar
        title      = "Dashboard"
        subtitle   = "Model performance and recent transactions"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div style={{ padding: '24px' }}>

        {error && (
          <div style={{
            background:'#fff', border:'1px solid #fecaca',
            borderRadius:'12px', padding:'14px 18px',
            color:'#dc2626', fontSize:'13px', marginBottom:'20px'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ color:'#94a3b8', textAlign:'center', paddingTop:'60px' }}>
            Loading dashboard...
          </p>
        ) : (
          <>
            {/* Stat cards */}
            <div style={{
              display             : 'grid',
              gridTemplateColumns : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap                 : '16px',
              marginBottom        : '24px',
            }}>
              <StatCard label="AUC-ROC Score"       value={metrics?.auc_roc}         sub="Target > 0.90"          icon="📈" iconBg="#eff6ff" />
              <StatCard label="AUC-PR Score"         value={metrics?.auc_pr}          sub="Target > 0.70"          icon="🎯" iconBg="#f0fdf4" />
              <StatCard label="Decision Threshold"   value={metrics?.threshold}       sub="Fraud if prob ≥ this"   icon="⚖️" iconBg="#fffbeb" />
              <StatCard label="Total Features"       value={metrics?.total_features}  sub="After feature engineering" icon="🧩" iconBg="#faf5ff" />
            </div>

            {/* Charts row */}
            <div style={{
              display             : 'grid',
              gridTemplateColumns : 'repeat(auto-fit, minmax(320px, 1fr))',
              gap                 : '20px',
              marginBottom        : '24px',
            }}>
              {/* Feature importance */}
              <div style={{
                background:'#fff', border:'1px solid #e2e8f0',
                borderRadius:'14px', padding:'20px',
                boxShadow:'0 1px 4px rgba(0,0,0,0.05)'
              }}>
                <p style={{ fontSize:'14px', fontWeight:'700', color:'#0f172a', margin:'0 0 4px' }}>
                  Top 10 Features
                </p>
                <p style={{ fontSize:'12px', color:'#94a3b8', margin:'0 0 16px' }}>
                  SHAP importance score
                </p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={features} layout="vertical" margin={{ left: 4, right: 16 }}>
                    <CartesianGrid horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill:'#475569', fontSize:11 }} width={75} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill:'#f8fafc' }} />
                    <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={16}>
                      {features.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Model info card */}
              <div style={{
                background:'#fff', border:'1px solid #e2e8f0',
                borderRadius:'14px', padding:'20px',
                boxShadow:'0 1px 4px rgba(0,0,0,0.05)'
              }}>
                <p style={{ fontSize:'14px', fontWeight:'700', color:'#0f172a', margin:'0 0 16px' }}>
                  Model Information
                </p>
                {[
                  { label: 'Model Name',       value: metrics?.model_name },
                  { label: 'Dataset',          value: 'IEEE-CIS Fraud Detection' },
                  { label: 'Total Features',   value: metrics?.total_features },
                  { label: 'AUC-ROC',          value: metrics?.auc_roc },
                  { label: 'AUC-PR',           value: metrics?.auc_pr },
                  { label: 'Threshold',        value: metrics?.threshold },
                ].map(row => (
                  <div key={row.label} style={{
                    display        : 'flex',
                    justifyContent : 'space-between',
                    alignItems     : 'center',
                    padding        : '10px 0',
                    borderBottom   : '1px solid #f1f5f9',
                  }}>
                    <span style={{ fontSize:'13px', color:'#64748b' }}>{row.label}</span>
                    <span style={{ fontSize:'13px', fontWeight:'600', color:'#0f172a' }}>{row.value}</span>
                  </div>
                ))}

                {/* API status */}
                <div style={{
                  marginTop    : '16px',
                  background   : '#f0fdf4',
                  border       : '1px solid #bbf7d0',
                  borderRadius : '10px',
                  padding      : '10px 14px',
                  display      : 'flex',
                  alignItems   : 'center',
                  gap          : '8px',
                }}>
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#22c55e' }} />
                  <span style={{ fontSize:'12px', fontWeight:'600', color:'#16a34a' }}>
                    FastAPI backend connected
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction history */}
            <div>
              <p style={{ fontSize:'14px', fontWeight:'700', color:'#0f172a', margin:'0 0 12px' }}>
                Recent Scored Transactions
              </p>
              <TransactionTable transactions={transactions} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}