import { useReactFlow } from '@xyflow/react'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

export function GraphControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      zIndex: 10,
    }}>
      <button
        onClick={() => zoomIn()}
        style={{
          width: 32,
          height: 32,
          background: '#2d2d44',
          border: '1px solid #3d3d5c',
          borderRadius: 6,
          color: '#a0aec0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Zoom in"
      >
        <ZoomIn size={14} />
      </button>
      <button
        onClick={() => zoomOut()}
        style={{
          width: 32,
          height: 32,
          background: '#2d2d44',
          border: '1px solid #3d3d5c',
          borderRadius: 6,
          color: '#a0aec0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Zoom out"
      >
        <ZoomOut size={14} />
      </button>
      <button
        onClick={() => fitView({ padding: 0.2 })}
        style={{
          width: 32,
          height: 32,
          background: '#2d2d44',
          border: '1px solid #3d3d5c',
          borderRadius: 6,
          color: '#a0aec0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Fit view"
      >
        <Maximize2 size={14} />
      </button>
    </div>
  )
}
