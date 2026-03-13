import { AnimatePresence, motion } from 'framer-motion'
import { useExplorerStore } from '../../store/explorerStore'
import { ModelDetail } from '../detail/ModelDetail'

export function DetailPanel() {
  const { detailPanelOpen, selectedModel, clearSelection } = useExplorerStore()

  return (
    <AnimatePresence>
      {detailPanelOpen && selectedModel && (
        <motion.div
          initial={{ x: 380, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 380, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            width: 380,
            background: '#fff',
            borderLeft: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <ModelDetail model={selectedModel} onClose={clearSelection} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
