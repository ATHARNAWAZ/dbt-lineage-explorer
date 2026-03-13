import { useState, useCallback } from 'react'
import { Upload, FileJson, AlertCircle } from 'lucide-react'

interface UploadZoneProps {
  onUpload: (file: File) => void
  loading: boolean
  error?: string
}

export function UploadZone({ onUpload, loading, error }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.json')) {
      onUpload(file)
    }
  }, [onUpload])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
  }, [onUpload])

  return (
    <label
      htmlFor="manifest-upload"
      onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{
        display: 'block',
        border: `2px dashed ${isDragging ? '#ff694a' : error ? '#e53e3e' : '#cbd5e0'}`,
        borderRadius: 12,
        padding: '48px 32px',
        textAlign: 'center',
        cursor: loading ? 'not-allowed' : 'pointer',
        background: isDragging ? '#fff5f3' : '#fff',
        transition: 'all 0.2s ease',
      }}
    >
      <input
        id="manifest-upload"
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileInput}
        disabled={loading}
      />

      <div style={{
        width: 64,
        height: 64,
        background: isDragging ? '#ff694a22' : '#f1f5f9',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        transition: 'background 0.2s',
      }}>
        {loading ? (
          <div style={{
            width: 24,
            height: 24,
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #ff694a',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        ) : (
          <Upload size={28} color={isDragging ? '#ff694a' : '#718096'} />
        )}
      </div>

      {loading ? (
        <>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#1a202c', marginBottom: 8 }}>
            Parsing manifest...
          </p>
          <p style={{ fontSize: 13, color: '#718096' }}>Building your DAG</p>
        </>
      ) : (
        <>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#1a202c', marginBottom: 8 }}>
            Drop your manifest.json here
          </p>
          <p style={{ fontSize: 13, color: '#718096', marginBottom: 4 }}>
            or <span style={{ color: '#ff694a', textDecoration: 'underline' }}>click to browse</span>
          </p>
          <p style={{ fontSize: 12, color: '#a0aec0' }}>
            Find it at: <code style={{ fontFamily: 'JetBrains Mono, monospace', background: '#f1f5f9', padding: '2px 4px', borderRadius: 3 }}>target/manifest.json</code>
          </p>
        </>
      )}

      {error && (
        <div style={{
          marginTop: 16,
          padding: '10px 14px',
          background: '#fff5f5',
          border: '1px solid #fed7d7',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#c53030',
          fontSize: 13,
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </label>
  )
}
