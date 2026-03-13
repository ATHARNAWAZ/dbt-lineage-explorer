const LAYER_COLORS: Record<string, { bg: string; text: string }> = {
  source: { bg: '#e2e8f0', text: '#718096' },
  staging: { bg: '#ebf8ff', text: '#2b6cb0' },
  intermediate: { bg: '#faf5ff', text: '#553c9a' },
  marts: { bg: '#f0fff4', text: '#276749' },
  exposure: { bg: '#fffaf0', text: '#c05621' },
  other: { bg: '#f7fafc', text: '#4a5568' },
}

export function LayerBadge({ layer }: { layer: string }) {
  const colors = LAYER_COLORS[layer] || LAYER_COLORS.other
  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 600,
      background: colors.bg,
      color: colors.text,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      {layer}
    </span>
  )
}
