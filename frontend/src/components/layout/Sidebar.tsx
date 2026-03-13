import { useMemo } from 'react'
import { useExplorerStore } from '../../store/explorerStore'
import { StatsCard } from '../sidebar/StatsCard'
import { SearchBar } from '../ui/SearchBar'
import { LayerFilter } from '../sidebar/LayerFilter'
import { TagFilter } from '../sidebar/TagFilter'
import { ModelList } from '../sidebar/ModelList'
import type { GraphData } from '../../types/graph'

interface SidebarProps {
  graphData: GraphData
}

export function Sidebar({ graphData }: SidebarProps) {
  const { searchQuery, setSearchQuery, activeFilters, setActiveFilters } = useExplorerStore()

  const filteredNodes = useMemo(() => {
    let nodes = graphData.nodes

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      nodes = nodes.filter(n =>
        n.name.toLowerCase().includes(q) ||
        (n.description || '').toLowerCase().includes(q)
      )
    }

    if (activeFilters.layers.length > 0) {
      nodes = nodes.filter(n => activeFilters.layers.includes(n.layer))
    }

    if (activeFilters.tags.length > 0) {
      nodes = nodes.filter(n =>
        activeFilters.tags.some(tag => n.tags.includes(tag))
      )
    }

    return nodes
  }, [graphData.nodes, searchQuery, activeFilters])

  const handleLayerToggle = (layer: string) => {
    const current = activeFilters.layers
    const next = current.includes(layer)
      ? current.filter(l => l !== layer)
      : [...current, layer]
    setActiveFilters({ ...activeFilters, layers: next })
  }

  const handleTagToggle = (tag: string) => {
    const current = activeFilters.tags
    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag]
    setActiveFilters({ ...activeFilters, tags: next })
  }

  return (
    <div style={{
      width: 280,
      background: '#fff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 28,
          height: 28,
          background: '#ff694a',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          flexShrink: 0,
        }}>
          dbt
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a202c', lineHeight: 1.2 }}>Lineage Explorer</div>
          <div style={{ fontSize: 10, color: '#a0aec0' }}>{graphData.stats.total_models} models</div>
        </div>
      </div>

      <StatsCard stats={graphData.stats} />

      <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={searchQuery ? filteredNodes.length : undefined}
        />
      </div>

      <LayerFilter
        activeLayers={activeFilters.layers}
        onToggle={handleLayerToggle}
        stats={graphData.stats}
      />

      <TagFilter
        nodes={graphData.nodes}
        activeTags={activeFilters.tags}
        onToggle={handleTagToggle}
      />

      <ModelList nodes={filteredNodes} />
    </div>
  )
}
