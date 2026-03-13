import { useExplorerStore } from '../../store/explorerStore'
import { apiService } from '../../services/apiService'
import type { GraphNode } from '../../types/graph'
import { LayerBadge } from '../ui/LayerBadge'

const LAYER_ORDER = ['source', 'staging', 'intermediate', 'marts', 'exposure', 'other']
const LAYER_LABELS: Record<string, string> = {
  source: 'Sources',
  staging: 'Staging',
  intermediate: 'Intermediate',
  marts: 'Marts',
  exposure: 'Exposures',
  other: 'Other',
}

interface ModelListProps {
  nodes: GraphNode[]
}

export function ModelList({ nodes }: ModelListProps) {
  const { selectedModelId, setSelectedModelId, setSelectedModel, setDetailPanelOpen } = useExplorerStore()

  const handleSelect = async (node: GraphNode) => {
    setSelectedModelId(node.id)
    setDetailPanelOpen(true)
    try {
      const model = await apiService.getModel(node.id)
      setSelectedModel(model)
    } catch {
      setSelectedModel(node)
    }
  }

  // Group by layer
  const grouped: Record<string, GraphNode[]> = {}
  nodes.forEach(node => {
    if (!grouped[node.layer]) grouped[node.layer] = []
    grouped[node.layer].push(node)
  })

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {LAYER_ORDER.map(layer => {
        const layerNodes = grouped[layer]
        if (!layerNodes || layerNodes.length === 0) return null

        return (
          <div key={layer}>
            <div style={{
              padding: '8px 16px 4px',
              fontSize: 10,
              fontWeight: 700,
              color: '#a0aec0',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              position: 'sticky',
              top: 0,
              background: '#fff',
              zIndex: 1,
              borderBottom: '1px solid #f1f5f9',
            }}>
              {LAYER_LABELS[layer]} ({layerNodes.length})
            </div>
            {layerNodes.map(node => {
              const isSelected = selectedModelId === node.id
              return (
                <button
                  key={node.id}
                  onClick={() => handleSelect(node)}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: isSelected ? '#fff5f3' : 'transparent',
                    border: 'none',
                    borderLeft: isSelected ? '3px solid #ff694a' : '3px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.background = '#f8fafc'
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: isSelected ? 600 : 400, color: isSelected ? '#ff694a' : '#1a202c', marginBottom: 2, fontFamily: 'JetBrains Mono, monospace' }}>
                    {node.name}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {node.test_count > 0 && (
                      <span style={{ fontSize: 10, color: '#48bb78' }}>
                        {node.test_count} tests
                      </span>
                    )}
                    {Object.keys(node.columns).length > 0 && (
                      <span style={{ fontSize: 10, color: '#a0aec0' }}>
                        {Object.keys(node.columns).length} cols
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
