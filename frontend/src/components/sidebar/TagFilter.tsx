import type { GraphNode } from '../../types/graph'

interface TagFilterProps {
  nodes: GraphNode[]
  activeTags: string[]
  onToggle: (tag: string) => void
}

export function TagFilter({ nodes, activeTags, onToggle }: TagFilterProps) {
  // Collect all unique tags with counts
  const tagCounts: Record<string, number> = {}
  nodes.forEach(node => {
    node.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  const tags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)

  if (tags.length === 0) return null

  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        Tags
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tags.map(([tag, count]) => {
          const isActive = activeTags.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              style={{
                padding: '3px 8px',
                background: isActive ? '#ff694a' : '#f1f5f9',
                border: 'none',
                borderRadius: 12,
                fontSize: 11,
                color: isActive ? '#fff' : '#4a5568',
                cursor: 'pointer',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              #{tag} <span style={{ opacity: 0.7 }}>{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
