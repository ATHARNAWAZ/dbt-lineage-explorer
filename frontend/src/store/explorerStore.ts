import { create } from 'zustand'
import type { GraphData, GraphNode } from '../types/graph'
import type { FilterState } from '../types/manifest'

interface ExplorerState {
  graphData: GraphData | null
  selectedModelId: string | null
  selectedModel: GraphNode | null
  highlightedNodes: string[]
  searchQuery: string
  activeFilters: FilterState
  detailPanelOpen: boolean

  setGraphData: (data: GraphData) => void
  setSelectedModelId: (id: string | null) => void
  setSelectedModel: (model: GraphNode | null) => void
  setHighlightedNodes: (nodes: string[]) => void
  setSearchQuery: (query: string) => void
  setActiveFilters: (filters: FilterState) => void
  setDetailPanelOpen: (open: boolean) => void
  clearSelection: () => void
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  graphData: null,
  selectedModelId: null,
  selectedModel: null,
  highlightedNodes: [],
  searchQuery: '',
  activeFilters: { layers: [], tags: [] },
  detailPanelOpen: false,

  setGraphData: (data) => set({ graphData: data }),
  setSelectedModelId: (id) => set({ selectedModelId: id }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setHighlightedNodes: (nodes) => set({ highlightedNodes: nodes }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
  clearSelection: () => set({
    selectedModelId: null,
    selectedModel: null,
    highlightedNodes: [],
    detailPanelOpen: false
  }),
}))
