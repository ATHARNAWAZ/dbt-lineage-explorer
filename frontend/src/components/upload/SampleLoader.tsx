import { ArrowRight, Database } from 'lucide-react'

interface SampleLoaderProps {
  onLoad: () => void
  loading: boolean
}

export function SampleLoader({ onLoad, loading }: SampleLoaderProps) {
  return (
    <button
      onClick={onLoad}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 20px',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        cursor: loading ? 'not-allowed' : 'pointer',
        width: '100%',
        transition: 'all 0.15s',
        opacity: loading ? 0.6 : 1,
      }}
      onMouseEnter={e => {
        if (!loading) {
          e.currentTarget.style.borderColor = '#ff694a'
          e.currentTarget.style.background = '#fff5f3'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e2e8f0'
        e.currentTarget.style.background = '#fff'
      }}
    >
      <div style={{
        width: 40,
        height: 40,
        background: '#f1f5f9',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Database size={20} color="#718096" />
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a202c' }}>
          Load sample project
        </div>
        <div style={{ fontSize: 12, color: '#718096' }}>
          Fintech pipeline: 19 models, 5 sources, 2 dashboards
        </div>
      </div>
      <ArrowRight size={16} color="#a0aec0" />
    </button>
  )
}
