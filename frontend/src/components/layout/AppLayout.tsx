import { Sidebar } from './Sidebar'
import { Canvas } from './Canvas'
import { DetailPanel } from './DetailPanel'
import type { GraphData } from '../../types/graph'

interface AppLayoutProps {
  graphData: GraphData
}

export function AppLayout({ graphData }: AppLayoutProps) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
    }}>
      <Sidebar graphData={graphData} />
      <Canvas graphData={graphData} />
      <DetailPanel />
    </div>
  )
}
