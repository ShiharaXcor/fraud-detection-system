import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar    from './components/Sidebar'
import Dashboard  from './pages/Dashboard'
import Predict    from './pages/Predict'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div style={{
        display       : 'flex',
        minHeight     : '100vh',
        background    : '#f0f4f8',
        fontFamily    : "'Plus Jakarta Sans', sans-serif",
      }}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div style={{
          flex       : 1,
          marginLeft : sidebarOpen ? '240px' : '0px',
          transition : 'margin-left 0.3s ease',
          minWidth   : 0,
        }}>
          <Routes>
            <Route path="/"        element={<Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
            <Route path="/predict" element={<Predict   sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}