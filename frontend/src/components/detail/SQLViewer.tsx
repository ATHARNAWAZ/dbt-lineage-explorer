import Editor from '@monaco-editor/react'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface SQLViewerProps {
  sql: string
  title?: string
}

export function SQLViewer({ sql, title = 'Compiled SQL' }: SQLViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: '#1e1e2e',
        borderBottom: '1px solid #2d2d44',
        borderRadius: '6px 6px 0 0',
      }}>
        <span style={{ fontSize: 12, color: '#a0aec0', fontFamily: 'JetBrains Mono, monospace' }}>
          {title}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: 'none',
            border: '1px solid #3d3d5c',
            borderRadius: 4,
            color: copied ? '#48bb78' : '#a0aec0',
            cursor: 'pointer',
            padding: '3px 8px',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 200 }}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={sql}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 12,
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 8 },
          }}
        />
      </div>
    </div>
  )
}
