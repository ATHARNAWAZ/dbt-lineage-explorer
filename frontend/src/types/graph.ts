export interface GraphNode {
  id: string
  name: string
  type: string
  layer: string
  description?: string
  tags: string[]
  columns: Record<string, ColumnDef>
  compiled_sql?: string
  raw_sql?: string
  depends_on: string[]
  referenced_by: string[]
  test_count: number
  test_results: TestResult[]
  materialization: string
  schema_name?: string
  database?: string
}

export interface ColumnDef {
  name?: string
  description?: string
  data_type?: string
  meta?: Record<string, unknown>
  tags?: string[]
}

export interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'warn'
  column: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  column_count: number
}

export interface GraphStats {
  total_models: number
  total_sources: number
  total_exposures: number
  total_tests: number
  test_coverage_pct: number
  models_by_layer: Record<string, number>
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  stats: GraphStats
}
