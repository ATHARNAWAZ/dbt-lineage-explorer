import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dbt-orange': '#ff694a',
        'dbt-orange-dark': '#e55a3a',
        'canvas-bg': '#1a1a2e',
        'layer-source': '#718096',
        'layer-staging': '#4299e1',
        'layer-intermediate': '#9f7aea',
        'layer-marts': '#48bb78',
        'layer-exposure': '#ed8936',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  },
  plugins: []
}

export default config
