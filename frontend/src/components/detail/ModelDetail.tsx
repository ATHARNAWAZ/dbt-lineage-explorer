import { useState } from 'react'
import { X, Database, Code2, TestTube, Zap, FileText } from 'lucide-react'
import { LayerBadge } from '../ui/LayerBadge'
import { SQLViewer } from './SQLViewer'
import { ColumnList } from './ColumnList'
import { TestResults } from './TestResults'
import { ImpactAnalysis } from './ImpactAnalysis'
import { ModelDocs } from './ModelDocs'
import type { GraphNode } from '../../types/graph'

interface ModelDetailProps {
  model: GraphNode
  onClose: () => void
}

type Tab = 'overview' | 'sql' | 'columns' | 'tests' | 'impact'

export function ModelDetail({ model, onClose }: ModelDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <FileText size={13} /> },
    { id: 'sql', label: 'SQL', icon: <Code2 size={13} /> },
    { id: 'columns', label: `Columns (${Object.keys(model.columns).length})`, icon: <Database size={13} /> },
    { id: 'tests', label: `Tests (${model.test_count})`, icon: <TestTube size={13} /> },
    { id: 'impact', label: 'Impact', icon: <Zap size={13} /> },
  ]

  const sql = model.compiled_sql || model.raw_sql || ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid #e2e8f0',
        background: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#1a202c',
              margin: '0 0 6px',
              fontFamily: 'JetBrains Mono, monospace',
              wordBreak: 'break-word',
            }}>
              {model.name}
            </h2>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <LayerBadge layer={model.layer} />
              <span style={{
                fontSize: 11,
                padding: '2px 6px',
                background: '#f1f5f9',
                borderRadius: 4,
                color: '#64748b',
              }}>
                {model.materialization}
              </span>
              {model.test_count > 0 && (
                <span style={{
                  fontSize: 11,
                  padding: '2px 6px',
                  background: '#f0fff4',
                  borderRadius: 4,
                  color: '#276749',
                }}>
                  {model.test_count} tests
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#a0aec0',
              padding: 4,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e2e8f0',
        background: '#fff',
        overflowX: 'auto',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #ff694a' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? '#ff694a' : '#718096',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'overview' && <ModelDocs model={model} />}

        {activeTab === 'sql' && (
          <div style={{ height: '100%', minHeight: 300 }}>
            {sql ? (
              <SQLViewer sql={sql} title={model.compiled_sql ? 'Compiled SQL' : 'Raw SQL'} />
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: '#718096', fontSize: 13 }}>
                No SQL available for this node type
              </div>
            )}
          </div>
        )}

        {activeTab === 'columns' && <ColumnList columns={model.columns} />}

        {activeTab === 'tests' && (
          <TestResults testResults={model.test_results as { name: string; status: 'pass' | 'fail' | 'warn'; column: string }[]} testCount={model.test_count} />
        )}

        {activeTab === 'impact' && (
          <ImpactAnalysis modelId={model.id} modelName={model.name} />
        )}
      </div>
    </div>
  )
}
