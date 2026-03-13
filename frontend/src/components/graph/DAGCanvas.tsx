import { useCallback, useEffect, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from '@dagrejs/dagre'
import { ModelNode } from './ModelNode'
import { SourceNode } from './SourceNode'
import { useExplorerStore } from '../../store/explorerStore'
import type { GraphData } from '../../types/graph'
import { apiService } from '../../services/apiService'

const nodeTypes = {
  modelNode: ModelNode,
  sourceNode: SourceNode,
}

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'LR') {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 40 })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 100 })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 110,
        y: nodeWithPosition.y - 50,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}

export function DAGCanvas({ graphData }: { graphData: GraphData }) {
  const {
    selectedModelId,
    setSelectedModelId,
    setSelectedModel,
    setDetailPanelOpen,
    clearSelection,
  } = useExplorerStore()

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Build ancestor/descendant sets for highlighting
  const { ancestorSet, descendantSet } = useMemo(() => {
    if (!selectedModelId) return { ancestorSet: new Set<string>(), descendantSet: new Set<string>() }

    const selected = graphData.nodes.find(n => n.id === selectedModelId)
    if (!selected) return { ancestorSet: new Set<string>(), descendantSet: new Set<string>() }

    // Build adjacency maps
    const parents: Record<string, string[]> = {}
    const children: Record<string, string[]> = {}

    graphData.edges.forEach(e => {
      if (!children[e.source]) children[e.source] = []
      if (!parents[e.target]) parents[e.target] = []
      children[e.source].push(e.target)
      parents[e.target].push(e.source)
    })

    // BFS for ancestors
    const ancestors = new Set<string>()
    const queue1 = [...(parents[selectedModelId] || [])]
    while (queue1.length > 0) {
      const n = queue1.shift()!
      if (!ancestors.has(n)) {
        ancestors.add(n)
        ;(parents[n] || []).forEach(p => queue1.push(p))
      }
    }

    // BFS for descendants
    const descendants = new Set<string>()
    const queue2 = [...(children[selectedModelId] || [])]
    while (queue2.length > 0) {
      const n = queue2.shift()!
      if (!descendants.has(n)) {
        descendants.add(n)
        ;(children[n] || []).forEach(c => queue2.push(c))
      }
    }

    return { ancestorSet: ancestors, descendantSet: descendants }
  }, [selectedModelId, graphData])

  useEffect(() => {
    const hasSelection = !!selectedModelId

    const rfNodes: Node[] = graphData.nodes.map((node) => {
      const isSelected = node.id === selectedModelId
      const isAncestor = ancestorSet.has(node.id)
      const isDescendant = descendantSet.has(node.id)
      const isDimmed = hasSelection && !isSelected && !isAncestor && !isDescendant

      return {
        id: node.id,
        type: node.type === 'source' ? 'sourceNode' : 'modelNode',
        position: { x: 0, y: 0 },
        data: {
          label: node.name,
          layer: node.layer,
          materialization: node.materialization,
          testCount: node.test_count,
          columnCount: Object.keys(node.columns).length,
          isSelected,
          isAncestor,
          isDescendant,
          isDimmed,
          schema: node.schema_name,
          database: node.database,
        },
      }
    })

    const rfEdges: Edge[] = graphData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      style: {
        stroke: '#4a5568',
        strokeWidth: 1.5,
        opacity: hasSelection ? 0.3 : 0.6,
      },
      animated: false,
    }))

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rfNodes, rfEdges)
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
  }, [graphData, selectedModelId, ancestorSet, descendantSet, setNodes, setEdges])

  const onNodeClick = useCallback(async (_: React.MouseEvent, node: Node) => {
    const modelId = node.id
    setSelectedModelId(modelId)
    setDetailPanelOpen(true)

    try {
      const model = await apiService.getModel(modelId)
      setSelectedModel(model)
    } catch {
      // Use from graphData as fallback
      const fallback = graphData.nodes.find(n => n.id === modelId)
      if (fallback) setSelectedModel(fallback)
    }
  }, [graphData, setSelectedModelId, setDetailPanelOpen, setSelectedModel])

  const onPaneClick = useCallback(() => {
    clearSelection()
  }, [clearSelection])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background variant={BackgroundVariant.Dots} color="#2d2d44" />
        <Controls style={{ background: '#2d2d44', borderColor: '#3d3d5c' }} />
        <MiniMap
          style={{ background: '#2d2d44' }}
          nodeColor={(n) => {
            const layer = (n.data as { layer?: string }).layer
            const colors: Record<string, string> = {
              source: '#718096',
              staging: '#4299e1',
              intermediate: '#9f7aea',
              marts: '#48bb78',
              exposure: '#ed8936',
            }
            return colors[layer || ''] || '#718096'
          }}
        />
      </ReactFlow>
    </div>
  )
}
