import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

interface SourceNodeData {
  label: string
  schema?: string
  database?: string
  isDimmed: boolean
  isAncestor: boolean
}

export const SourceNode = memo(({ data }: { data: SourceNodeData }) => {
  return (
    <div
      style={{
        width: 180,
        background: '#f8fafc',
        borderRadius: 8,
        border: data.isAncestor ? '2px solid #4299e1' : '1px solid #cbd5e0',
        opacity: data.isDimmed ? 0.3 : 1,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ height: 4, background: '#718096' }} />
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 600, fontSize: 12, color: '#4a5568', wordBreak: 'break-word' }}>
          {data.label}
        </div>
        <span style={{
          fontSize: 10,
          padding: '2px 6px',
          borderRadius: 4,
          background: '#e2e8f0',
          color: '#718096',
          display: 'inline-block',
          marginTop: 4,
        }}>
          source
        </span>
        {data.database && data.schema && (
          <div style={{ fontSize: 10, color: '#a0aec0', marginTop: 4 }}>
            {data.database}.{data.schema}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#718096' }} />
    </div>
  )
})

SourceNode.displayName = 'SourceNode'
