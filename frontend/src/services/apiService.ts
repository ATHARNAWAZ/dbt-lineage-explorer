import type { GraphData, GraphNode } from '../types/graph'
import type { LineageResult, ImpactResult } from '../types/lineage'

// Use relative paths so Vite proxy handles routing to the backend.
// Vite proxy: /api -> http://localhost:8000
const BASE = '/api'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try { msg = await res.text() } catch {}
    throw new Error(msg)
  }
  return res.json()
}

export const apiService = {
  async uploadManifest(file: File): Promise<GraphData> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${BASE}/manifest/upload`, {
      method: 'POST',
      body: formData,
    })
    return handleResponse<GraphData>(res)
  },

  async loadSample(): Promise<GraphData> {
    const res = await fetch(`${BASE}/manifest/sample`)
    return handleResponse<GraphData>(res)
  },

  async getGraph(): Promise<GraphData> {
    const res = await fetch(`${BASE}/graph`)
    return handleResponse<GraphData>(res)
  },

  async getModel(modelId: string): Promise<GraphNode> {
    const res = await fetch(`${BASE}/models/${encodeURIComponent(modelId)}`)
    return handleResponse<GraphNode>(res)
  },

  async getLineage(modelId: string): Promise<LineageResult> {
    const res = await fetch(`${BASE}/lineage/${encodeURIComponent(modelId)}`)
    return handleResponse<LineageResult>(res)
  },

  async getImpactAnalysis(modelId: string): Promise<ImpactResult> {
    const res = await fetch(`${BASE}/impact/${encodeURIComponent(modelId)}`, {
      method: 'POST',
    })
    return handleResponse<ImpactResult>(res)
  },
}
