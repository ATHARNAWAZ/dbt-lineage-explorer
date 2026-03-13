import type { GraphStats } from '../../types/graph'

const LAYERS = [
  { id: 'source', label: 'Sources', color: '#718096' },
  { id: 'staging', label: 'Staging', color: '#4299e1' },
  { id: 'intermediate', label: 'Intermediate', color: '#9f7aea' },
  { id: 'marts', label: 'Marts', color: '#48bb78' },
  { id: 'exposure', label: 'Exposures', color: '#ed8936' },
]

interface LayerFilterProps {
  activeLayers: string[]
  onToggle: (layer: string) => void
  stats: GraphStats
}

export function LayerFilter({ activeLayers, onToggle, stats }: LayerFilterProps) {
  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        Layers
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {LAYERS.map(layer => {
          const count = stats.models_by_layer[layer.id] || 0
          if (count === 0) return null
          const isActive = activeLayers.includes(layer.id)
          return (
            <button
              key={layer.id}
              onClick={() => onToggle(layer.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 10px',
                background: isActive ? `${layer.color}15` : 'transparent',
                border: isActive ? `1px solid ${layer.color}40` : '1px solid transparent',
                borderRadius: 6,
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: layer.color,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 12, color: isActive ? layer.color : '#4a5568', fontWeight: isActive ? 600 : 400 }}>
                  {layer.label}
                </span>
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: isActive ? layer.color : '#a0aec0',
                background: isActive ? `${layer.color}20` : '#f1f5f9',
                padding: '1px 6px',
                borderRadius: 10,
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
