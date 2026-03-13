import type { GraphStats } from '../../types/graph'

interface StatsCardProps {
  stats: GraphStats
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <div style={{
      padding: '12px 16px',
      background: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
      }}>
        <StatItem label="Models" value={stats.total_models} color="#4299e1" />
        <StatItem label="Sources" value={stats.total_sources} color="#718096" />
        <StatItem label="Tests" value={stats.total_tests} color="#9f7aea" />
        <StatItem label="Coverage" value={`${stats.test_coverage_pct}%`} color="#48bb78" />
      </div>
    </div>
  )
}

function StatItem({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 6,
      padding: '8px 10px',
      border: '1px solid #e2e8f0',
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  )
}
