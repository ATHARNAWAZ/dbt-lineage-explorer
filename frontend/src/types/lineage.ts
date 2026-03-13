export interface ColumnLineage {
  source_model?: string
  source_column: string
  transformation: string
  description?: string
}

export interface LineageResult {
  model_id: string
  ancestors: string[]
  descendants: string[]
  column_lineage: Record<string, ColumnLineage>
}

export interface ImpactResult {
  model_id: string
  model_name: string
  direct_children: string[]
  all_descendants: string[]
  critical_path: string[]
  affected_marts: string[]
  affected_exposures: string[]
  impact_score: number
  ai_explanation?: string
}
