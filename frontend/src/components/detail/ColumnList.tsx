import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ColumnDef } from '../../types/graph'

interface ColumnListProps {
  columns: Record<string, ColumnDef>
}

export function ColumnList({ columns }: ColumnListProps) {
  const [expandedCol, setExpandedCol] = useState<string | null>(null)

  const entries = Object.entries(columns)

  if (entries.length === 0) {
    return (
      <div style={{ padding: 16, color: '#718096', fontSize: 13, textAlign: 'center' }}>
        No column definitions found
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        padding: '6px 12px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        fontSize: 11,
        fontWeight: 600,
        color: '#718096',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        <span>Column</span>
        <span>Type</span>
      </div>
      {entries.map(([key, col]) => {
        const name = col.name || key
        const dataType = col.data_type || 'unknown'
        const description = col.description || ''
        const isExpanded = expandedCol === key

        return (
          <div key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div
              onClick={() => setExpandedCol(isExpanded ? null : key)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                alignItems: 'center',
                padding: '8px 12px',
                cursor: 'pointer',
                background: isExpanded ? '#f8fafc' : 'transparent',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background = isExpanded ? '#f8fafc' : 'transparent')}
            >
              <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#1a202c', fontWeight: 500 }}>
                {name}
              </span>
              <span style={{ fontSize: 11, color: '#718096', fontFamily: 'JetBrains Mono, monospace' }}>
                {dataType}
              </span>
              <span style={{ color: '#a0aec0' }}>
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </span>
            </div>
            {isExpanded && (
              <div style={{
                padding: '8px 16px 12px',
                background: '#fafafa',
                borderTop: '1px solid #f1f5f9',
              }}>
                {description ? (
                  <p style={{ fontSize: 12, color: '#4a5568', margin: 0, lineHeight: 1.5 }}>
                    {description}
                  </p>
                ) : (
                  <p style={{ fontSize: 12, color: '#a0aec0', margin: 0, fontStyle: 'italic' }}>
                    No description available
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
