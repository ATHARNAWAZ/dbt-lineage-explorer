import type { GraphData, GraphNode } from '../types/graph'
import type { LineageResult, ImpactResult } from '../types/lineage'

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

  // Model lookup is now client-side — kept for compatibility
  async getModel(_modelId: string): Promise<GraphNode> {
    throw new Error('Use local graphData instead')
  },

  // Stateless: sends full graphData in body so Vercel serverless works
  async getLineage(modelId: string, graphData: GraphData): Promise<LineageResult> {
    const res = await fetch(`${BASE}/lineage/${encodeURIComponent(modelId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphData),
    })
    return handleResponse<LineageResult>(res)
  },

  // Stateless: sends full graphData in body so Vercel serverless works
  async getImpactAnalysis(modelId: string, graphData: GraphData): Promise<ImpactResult> {
    const res = await fetch(`${BASE}/impact/${encodeURIComponent(modelId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphData),
    })
    return handleResponse<ImpactResult>(res)
  },
}
