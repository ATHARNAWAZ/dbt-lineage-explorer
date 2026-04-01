import { useState } from 'react'
import { Zap, Copy, Check, AlertTriangle } from 'lucide-react'
import { apiService } from '../../services/apiService'
import { useExplorerStore } from '../../store/explorerStore'
import type { ImpactResult } from '../../types/lineage'

interface ImpactAnalysisProps {
  modelId: string
  modelName: string
}

function ImpactScoreCircle({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 70) return '#e53e3e'
    if (score >= 40) return '#ed8936'
    return '#48bb78'
  }

  const getRiskLabel = () => {
    if (score >= 70) return 'High Risk'
    if (score >= 40) return 'Medium Risk'
    return 'Low Risk'
  }

  const color = getColor()
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative', width: 88, height: 88 }}>
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle
            cx="44" cy="44" r="36"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="44" cy="44" r="36"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 44 44)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color }}>{score}</div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: color }}>{getRiskLabel()}</div>
        <div style={{ fontSize: 12, color: '#718096' }}>Impact score: {score}/100</div>
      </div>
    </div>
  )
}

export function ImpactAnalysis({ modelId, modelName }: ImpactAnalysisProps) {
  const [result, setResult] = useState<ImpactResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const graphData = useExplorerStore(s => s.graphData)

  const handleAnalyze = async () => {
    if (!graphData) { setError('No graph data loaded'); return }
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getImpactAnalysis(modelId, graphData)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyReport = async () => {
    if (!result) return
    const report = `Impact Analysis Report: ${modelName}
Impact Score: ${result.impact_score}/100
Direct Children: ${result.direct_children.length}
All Descendants: ${result.all_descendants.length}
Affected Marts: ${result.affected_marts.join(', ') || 'none'}
Affected Exposures: ${result.affected_exposures.join(', ') || 'none'}

AI Analysis:
${result.ai_explanation || 'Not available'}`

    await navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: 16 }}>
      {!result ? (
        <div style={{ textAlign: 'center', paddingTop: 24 }}>
          <div style={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #ff694a22, #ff694a11)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Zap size={28} color="#ff694a" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1a202c', marginBottom: 8 }}>
            Impact Analysis
          </h3>
          <p style={{ fontSize: 13, color: '#718096', marginBottom: 20, lineHeight: 1.5 }}>
            Analyze how changes to <strong>{modelName}</strong> affect downstream models, dashboards, and reports.
          </p>
          {error && (
            <div style={{
              padding: '8px 12px',
              background: '#fff5f5',
              border: '1px solid #fed7d7',
              borderRadius: 6,
              color: '#c53030',
              fontSize: 12,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <AlertTriangle size={14} />
              {error}
            </div>
          )}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              background: loading ? '#a0aec0' : '#ff694a',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Zap size={16} />
            {loading ? 'Analyzing...' : 'Analyze Impact'}
          </button>
        </div>
      ) : (
        <div>
          <ImpactScoreCircle score={result.impact_score} />

          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <StatBox label="Direct Children" value={result.direct_children.length} color="#4299e1" />
              <StatBox label="All Descendants" value={result.all_descendants.length} color="#9f7aea" />
              <StatBox label="Affected Marts" value={result.affected_marts.length} color="#48bb78" />
            </div>

            {result.affected_exposures.length > 0 && (
              <Section title="Affected Dashboards">
                {result.affected_exposures.map(exp => (
                  <ModelChip key={exp} name={exp} color="#ed8936" />
                ))}
              </Section>
            )}

            {result.affected_marts.length > 0 && (
              <Section title="Affected Mart Models">
                {result.affected_marts.map(mart => (
                  <ModelChip key={mart} name={mart} color="#48bb78" />
                ))}
              </Section>
            )}

            {result.critical_path.length > 0 && (
              <Section title="Critical Path">
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                  {result.critical_path.map((node, idx) => (
                    <span key={node} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#4a5568', background: '#f8fafc', padding: '2px 6px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        {node.split('.').slice(-1)[0]}
                      </span>
                      {idx < result.critical_path.length - 1 && <span style={{ color: '#a0aec0', fontSize: 12 }}>→</span>}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {result.ai_explanation && (
              <Section title="AI Analysis">
                <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {result.ai_explanation}
                </p>
              </Section>
            )}

            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button
                onClick={handleCopyReport}
                style={{
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 12,
                  color: '#4a5568',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {copied ? <Check size={14} color="#48bb78" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Report'}
              </button>
              <button
                onClick={() => setResult(null)}
                style={{
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 12,
                  color: '#718096',
                  cursor: 'pointer',
                }}
              >
                Re-analyze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      flex: 1,
      padding: '10px',
      background: '#f8fafc',
      borderRadius: 6,
      border: '1px solid #e2e8f0',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h4 style={{ fontSize: 11, fontWeight: 600, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        {title}
      </h4>
      {children}
    </div>
  )
}

function ModelChip({ name, color }: { name: string; color: string }) {
  const shortName = name.split('.').slice(-1)[0]
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 8px',
      background: `${color}15`,
      border: `1px solid ${color}40`,
      borderRadius: 4,
      fontSize: 11,
      fontFamily: 'JetBrains Mono, monospace',
      color: color,
      marginRight: 4,
      marginBottom: 4,
    }}>
      {shortName}
    </span>
  )
}
