import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExplorerStore } from '../store/explorerStore'
import { AppLayout } from '../components/layout/AppLayout'

export default function Explorer() {
  const navigate = useNavigate()
  const graphData = useExplorerStore(s => s.graphData)

  useEffect(() => {
    if (!graphData) {
      navigate('/')
    }
  }, [graphData, navigate])

  if (!graphData) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f8f9fa',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 32,
            height: 32,
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #ff694a',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#718096', fontSize: 14 }}>Loading explorer...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return <AppLayout graphData={graphData} />
}
