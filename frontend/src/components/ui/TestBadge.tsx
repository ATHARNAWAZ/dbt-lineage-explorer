const STATUS_COLORS = {
  pass: { bg: '#f0fff4', text: '#276749', label: 'Pass' },
  fail: { bg: '#fff5f5', text: '#c53030', label: 'Fail' },
  warn: { bg: '#fffaf0', text: '#c05621', label: 'Warn' },
}

export function TestBadge({ status }: { status: 'pass' | 'fail' | 'warn' }) {
  const colors = STATUS_COLORS[status]
  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 500,
      background: colors.bg,
      color: colors.text,
    }}>
      {colors.label}
    </span>
  )
}
