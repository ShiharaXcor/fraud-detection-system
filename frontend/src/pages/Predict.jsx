import { useState } from 'react'
import axios      from 'axios'
import TopBar     from '../components/TopBar'
import ScoreCard  from '../components/ScoreCard'
import ShapChart  from '../components/ShapChart'

const API = 'http://localhost:8000'

const FIELDS = [
  { name:'TransactionAmt', label:'Transaction Amount ($)', type:'number', placeholder:'150.00',    required:true,  col:1 },
  { name:'ProductCD',      label:'Product Code',           type:'text',   placeholder:'W',         required:true,  col:1 },
  { name:'card1',          label:'Card 1',                 type:'number', placeholder:'9500',       required:false, col:1 },
  { name:'card2',          label:'Card 2',                 type:'number', placeholder:'360',        required:false, col:1 },
  { name:'card4',          label:'Card Network',           type:'text',   placeholder:'visa',       required:false, col:1 },
  { name:'card6',          label:'Card Type',              type:'text',   placeholder:'debit',      required:false, col:1 },
  { name:'P_emaildomain',  label:'Purchaser Email Domain', type:'text',   placeholder:'gmail.com',  required:false, col:1 },
  { name:'R_emaildomain',  label:'Recipient Email Domain', type:'text',   placeholder:'gmail.com',  required:false, col:1 },
  { name:'addr1',          label:'Billing Address Code',   type:'number', placeholder:'315',        required:false, col:1 },
  { name:'addr2',          label:'Country Code',           type:'number', placeholder:'87',         required:false, col:1 },
  { name:'TransactionDT',  label:'Transaction Time (sec)', type:'number', placeholder:'86400',      required:false, col:1 },
  { name:'C1',  label:'C1',  type:'number', placeholder:'1',  required:false, col:1 },
  { name:'C2',  label:'C2',  type:'number', placeholder:'1',  required:false, col:1 },
  { name:'C13', label:'C13', type:'number', placeholder:'20', required:false, col:1 },
  { name:'C14', label:'C14', type:'number', placeholder:'1',  required:false, col:1 },
]

const inputStyle = {
  width        : '100%',
  padding      : '9px 12px',
  borderRadius : '8px',
  border       : '1px solid #e2e8f0',
  fontSize     : '13px',
  color        : '#0f172a',
  background   : '#ffffff',
  outline      : 'none',
  boxSizing    : 'border-box',
  transition   : 'border-color 0.2s',
}

export default function Predict({ sidebarOpen, setSidebarOpen }) {
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData(e.target)
    const data = {}
    FIELDS.forEach(f => {
      const val = formData.get(f.name)
      if (val !== '' && val !== null) {
        data[f.name] = f.type === 'number' ? parseFloat(val) : val
      }
    })

    try {
      const res        = await axios.post(`${API}/predict`, data)
      const prediction = res.data
      setResult(prediction)

      const history = JSON.parse(localStorage.getItem('fraud_transactions') || '[]')
      history.unshift({
        ...prediction,
        amount : data.TransactionAmt,
        time   : new Date().toLocaleTimeString(),
      })
      localStorage.setItem('fraud_transactions', JSON.stringify(history.slice(0, 20)))

    } catch (err) {
      setError(err.response?.data?.detail || 'Cannot connect to API on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#f0f4f8' }}>
      <TopBar
        title         = "Predict Transaction"
        subtitle      = "Score a transaction for fraud probability"
        sidebarOpen   = {sidebarOpen}
        setSidebarOpen= {setSidebarOpen}
      />

      <div style={{ padding:'24px', maxWidth:'960px' }}>

        {/* Form card */}
        <div style={{
          background   : '#ffffff',
          border       : '1px solid #e2e8f0',
          borderRadius : '14px',
          padding      : '24px',
          boxShadow    : '0 1px 4px rgba(0,0,0,0.05)',
          marginBottom : '20px',
        }}>
          {/* Card header */}
          <div style={{
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'space-between',
            marginBottom   : '20px',
            paddingBottom  : '16px',
            borderBottom   : '1px solid #f1f5f9',
          }}>
            <div>
              <p style={{ fontSize:'15px', fontWeight:'700', color:'#0f172a', margin:0 }}>
                Transaction Details
              </p>
              <p style={{ fontSize:'12px', color:'#94a3b8', margin:'3px 0 0' }}>
                Fields marked * are required. Others are optional but improve accuracy.
              </p>
            </div>
            <span style={{
              background:'#eff6ff', color:'#2563eb',
              borderRadius:'999px', padding:'4px 12px',
              fontSize:'11px', fontWeight:'600',
            }}>
              {FIELDS.length} fields
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{
              display             : 'grid',
              gridTemplateColumns : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap                 : '16px',
              marginBottom        : '20px',
            }}>
              {FIELDS.map(f => (
                <div key={f.name}>
                  <label style={{
                    display      : 'block',
                    fontSize     : '12px',
                    fontWeight   : '500',
                    color        : '#475569',
                    marginBottom : '5px',
                  }}>
                    {f.label}
                    {f.required && <span style={{ color:'#ef4444' }}> *</span>}
                  </label>
                  <input
                    name        = {f.name}
                    type        = {f.type}
                    placeholder = {f.placeholder}
                    required    = {f.required}
                    step        = {f.type === 'number' ? 'any' : undefined}
                    style       = {inputStyle}
                    onFocus     = {e => e.target.style.borderColor = '#2563eb'}
                    onBlur      = {e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type     = "submit"
              disabled = {loading}
              style={{
                width        : '100%',
                padding      : '12px',
                background   : loading ? '#e2e8f0' : '#2563eb',
                color        : loading ? '#94a3b8' : '#ffffff',
                border       : 'none',
                borderRadius : '10px',
                fontSize     : '14px',
                fontWeight   : '600',
                cursor       : loading ? 'not-allowed' : 'pointer',
                transition   : 'background 0.2s',
              }}
            >
              {loading ? 'Analyzing transaction...' : 'Analyze Transaction'}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:'#fff', border:'1px solid #fecaca',
            borderRadius:'12px', padding:'14px 18px',
            color:'#dc2626', fontSize:'13px', marginBottom:'20px',
          }}>
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            <div style={{
              display             : 'grid',
              gridTemplateColumns : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap                 : '20px',
              marginBottom        : '20px',
            }}>
              <ScoreCard result={result} />
              <ShapChart features={result.top_features} />
            </div>

            {/* Risk guide */}
            <div style={{
              background   : '#fff',
              border       : '1px solid #e2e8f0',
              borderRadius : '14px',
              padding      : '16px 20px',
              boxShadow    : '0 1px 4px rgba(0,0,0,0.04)',
              display      : 'flex',
              alignItems   : 'center',
              gap          : '24px',
              flexWrap     : 'wrap',
            }}>
              <p style={{ fontSize:'12px', fontWeight:'600', color:'#64748b', margin:0 }}>
                Risk Guide:
              </p>
              {[
                { label:'Low Risk',    color:'#16a34a', bg:'#dcfce7', desc:'prob < 50%'  },
                { label:'Medium Risk', color:'#d97706', bg:'#fef9c3', desc:'50% – 70%'  },
                { label:'High Risk',   color:'#dc2626', bg:'#fee2e2', desc:'prob ≥ 70%'  },
              ].map(r => (
                <div key={r.label} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{
                    background:'none', color:r.color,
                    border:`1px solid ${r.color}44`,
                    borderRadius:'999px', padding:'2px 10px',
                    fontSize:'11px', fontWeight:'600',
                  }}>{r.label}</span>
                  <span style={{ fontSize:'12px', color:'#94a3b8' }}>{r.desc}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}