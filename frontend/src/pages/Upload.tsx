import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadZone } from '../components/upload/UploadZone'
import { SampleLoader } from '../components/upload/SampleLoader'
import { useExplorerStore } from '../store/explorerStore'
import { apiService } from '../services/apiService'

export default function Upload() {
  const navigate = useNavigate()
  const setGraphData = useExplorerStore(s => s.setGraphData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const handleUpload = async (file: File) => {
    setLoading(true)
    setError(undefined)
    try {
      const data = await apiService.uploadManifest(file)
      setGraphData(data)
      navigate('/explorer')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse manifest')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadSample = async () => {
    setLoading(true)
    setError(undefined)
    try {
      const data = await apiService.loadSample()
      setGraphData(data)
      navigate('/explorer')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sample')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {/* Logo / Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          background: '#ff694a',
          borderRadius: 14,
          marginBottom: 16,
          boxShadow: '0 4px 20px rgba(255, 105, 74, 0.3)',
        }}>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>dbt</span>
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          color: '#1a202c',
          marginBottom: 8,
          letterSpacing: '-0.5px',
        }}>
          Lineage Explorer
        </h1>
        <p style={{ fontSize: 15, color: '#718096', maxWidth: 400, lineHeight: 1.5 }}>
          Visualize, explore and understand your entire dbt project. Parse your manifest and explore the DAG interactively.
        </p>
      </div>

      {/* Upload area */}
      <div style={{ width: '100%', maxWidth: 520 }}>
        <UploadZone onUpload={handleUpload} loading={loading} error={error} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          <span style={{ fontSize: 12, color: '#a0aec0', whiteSpace: 'nowrap' }}>or try a demo</span>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        </div>

        <SampleLoader onLoad={handleLoadSample} loading={loading} />
      </div>

      {/* Features */}
      <div style={{
        display: 'flex',
        gap: 24,
        marginTop: 48,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[
          { label: 'Interactive DAG', desc: 'Zoom, pan, and click any model' },
          { label: 'SQL Viewer', desc: 'Monaco editor with syntax highlighting' },
          { label: 'Impact Analysis', desc: 'Claude AI explains downstream risk' },
        ].map(f => (
          <div key={f.label} style={{ textAlign: 'center', maxWidth: 140 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a202c', marginBottom: 4 }}>{f.label}</div>
            <div style={{ fontSize: 12, color: '#a0aec0' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
