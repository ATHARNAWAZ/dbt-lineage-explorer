import { LayerBadge } from '../ui/LayerBadge'
import type { GraphNode } from '../../types/graph'

interface ModelDocsProps {
  model: GraphNode
}

export function ModelDocs({ model }: ModelDocsProps) {
  return (
    <div style={{ padding: 16 }}>
      {/* Description */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Description
        </h4>
        {model.description ? (
          <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6, margin: 0 }}>
            {model.description}
          </p>
        ) : (
          <p style={{ fontSize: 13, color: '#a0aec0', fontStyle: 'italic', margin: 0 }}>
            No description provided
          </p>
        )}
      </div>

      {/* Metadata */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Metadata
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MetaRow label="Layer" value={<LayerBadge layer={model.layer} />} />
          <MetaRow label="Materialization" value={model.materialization} />
          {model.schema_name && <MetaRow label="Schema" value={model.schema_name} />}
          {model.database && <MetaRow label="Database" value={model.database} />}
          <MetaRow label="Type" value={model.type} />
        </div>
      </div>

      {/* Tags */}
      {model.tags.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Tags
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {model.tags.map(tag => (
              <span key={tag} style={{
                padding: '3px 8px',
                background: '#f1f5f9',
                borderRadius: 4,
                fontSize: 11,
                color: '#4a5568',
                border: '1px solid #e2e8f0',
              }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dependencies */}
      {model.depends_on.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Depends On ({model.depends_on.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {model.depends_on.map(dep => (
              <div key={dep} style={{
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                color: '#4a5568',
                padding: '4px 8px',
                background: '#f8fafc',
                borderRadius: 4,
                border: '1px solid #e2e8f0',
              }}>
                {dep.split('.').slice(-1)[0]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referenced by */}
      {model.referenced_by.length > 0 && (
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Referenced By ({model.referenced_by.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {model.referenced_by.map(ref => (
              <div key={ref} style={{
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                color: '#4a5568',
                padding: '4px 8px',
                background: '#f8fafc',
                borderRadius: 4,
                border: '1px solid #e2e8f0',
              }}>
                {ref.split('.').slice(-1)[0]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: '#718096' }}>{label}</span>
      {typeof value === 'string' ? (
        <span style={{ fontSize: 12, color: '#1a202c', fontWeight: 500 }}>{value}</span>
      ) : value}
    </div>
  )
}
