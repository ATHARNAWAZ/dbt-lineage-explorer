import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

const LAYER_COLORS: Record<string, string> = {
  source: '#718096',
  staging: '#4299e1',
  intermediate: '#9f7aea',
  marts: '#48bb78',
  exposure: '#ed8936',
  other: '#718096',
}

interface ModelNodeData {
  label: string
  layer: string
  materialization: string
  testCount: number
  columnCount: number
  isSelected: boolean
  isAncestor: boolean
  isDescendant: boolean
  isDimmed: boolean
}

export const ModelNode = memo(({ data }: { data: ModelNodeData }) => {
  const layerColor = LAYER_COLORS[data.layer] || '#718096'

  const getTestIcon = () => {
    if (data.testCount === 0) return '—'
    return '✓'
  }

  const getBorderStyle = () => {
    if (data.isSelected) return `2px solid #ff694a`
    if (data.isAncestor) return `2px solid #4299e1`
    if (data.isDescendant) return `2px solid #48bb78`
    return `1px solid #e2e8f0`
  }

  const getOpacity = () => {
    if (data.isDimmed) return 0.3
    return 1
  }

  return (
    <div
      style={{
        width: 200,
        background: '#ffffff',
        borderRadius: 8,
        border: getBorderStyle(),
        boxShadow: data.isSelected
          ? '0 4px 20px rgba(255, 105, 74, 0.3)'
          : '0 2px 8px rgba(0,0,0,0.15)',
        opacity: getOpacity(),
        transition: 'all 0.2s ease',
        overflow: 'hidden',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: layerColor }} />

      {/* Layer color bar */}
      <div style={{ height: 4, background: layerColor }} />

      {/* Content */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#1a202c', marginBottom: 4, wordBreak: 'break-word' }}>
          {data.label}
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 4,
            background: `${layerColor}20`,
            color: layerColor,
            fontWeight: 500,
          }}>
            {data.layer}
          </span>
          <span style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 4,
            background: '#f1f5f9',
            color: '#64748b',
          }}>
            {data.materialization}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#718096' }}>
          <span>{getTestIcon()} {data.testCount} tests</span>
          <span>{data.columnCount} cols</span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} style={{ background: layerColor }} />
    </div>
  )
})

ModelNode.displayName = 'ModelNode'
