import { ReactFlowProvider } from '@xyflow/react'
import { DAGCanvas } from '../graph/DAGCanvas'
import type { GraphData } from '../../types/graph'

interface CanvasProps {
  graphData: GraphData
}

export function Canvas({ graphData }: CanvasProps) {
  return (
    <div style={{
      flex: 1,
      background: '#1a1a2e',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <ReactFlowProvider>
        <DAGCanvas graphData={graphData} />
      </ReactFlowProvider>
    </div>
  )
}
