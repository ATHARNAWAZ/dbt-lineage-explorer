import { TestBadge } from '../ui/TestBadge'
import type { TestResult } from '../../types/graph'

interface TestResultsProps {
  testResults: TestResult[]
  testCount: number
}

export function TestResults({ testResults, testCount }: TestResultsProps) {
  const passing = testResults.filter(t => t.status === 'pass').length
  const failing = testResults.filter(t => t.status === 'fail').length
  const warning = testResults.filter(t => t.status === 'warn').length

  if (testCount === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>—</div>
        <p style={{ color: '#718096', fontSize: 13 }}>No tests defined for this model</p>
        <p style={{ color: '#a0aec0', fontSize: 12 }}>Add tests in your schema.yml to improve data quality</p>
      </div>
    )
  }

  return (
    <div>
      {/* Summary bar */}
      <div style={{
        display: 'flex',
        gap: 12,
        padding: '12px 16px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#276749' }}>{passing}</div>
          <div style={{ fontSize: 10, color: '#718096', textTransform: 'uppercase' }}>Passing</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#c53030' }}>{failing}</div>
          <div style={{ fontSize: 10, color: '#718096', textTransform: 'uppercase' }}>Failing</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#c05621' }}>{warning}</div>
          <div style={{ fontSize: 10, color: '#718096', textTransform: 'uppercase' }}>Warnings</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a202c' }}>{testCount}</div>
          <div style={{ fontSize: 10, color: '#718096', textTransform: 'uppercase' }}>Total</div>
        </div>
      </div>

      {/* Test list */}
      <div>
        {testResults.map((test, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 16px',
            borderBottom: '1px solid #f1f5f9',
          }}>
            <div>
              <div style={{ fontSize: 12, color: '#1a202c', fontFamily: 'JetBrains Mono, monospace' }}>
                {test.name}
              </div>
              {test.column && (
                <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>
                  column: {test.column}
                </div>
              )}
            </div>
            <TestBadge status={test.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
