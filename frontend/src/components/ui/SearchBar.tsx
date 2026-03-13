import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  resultCount?: number
}

export function SearchBar({ value, onChange, placeholder = 'Search models...', resultCount }: SearchBarProps) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#a0aec0',
        pointerEvents: 'none',
      }}>
        <Search size={14} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          paddingLeft: 32,
          paddingRight: value ? 32 : 12,
          paddingTop: 8,
          paddingBottom: 8,
          fontSize: 13,
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          outline: 'none',
          background: '#f8fafc',
          color: '#1a202c',
          boxSizing: 'border-box',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#a0aec0',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={14} />
        </button>
      )}
      {resultCount !== undefined && value && (
        <div style={{
          fontSize: 11,
          color: '#718096',
          marginTop: 4,
          paddingLeft: 2,
        }}>
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
