# QA Evidence Log

## Pipeline Summary
- Project: dbt Lineage Explorer
- Date: 2026-03-13
- Status: COMPLETED

## Phase 1: Backend Tests
All 14 pytest tests PASS:
- test_health_endpoint: PASS
- test_upload_manifest_returns_200: PASS
- test_get_graph_after_upload: PASS
- test_get_model_detail: PASS
- test_impact_analysis_endpoint: PASS
- test_ancestors_of_fct_orders: PASS
- test_descendants_of_stg_orders: PASS
- test_impact_scope_returns_all_fields: PASS
- test_shortest_path_between_nodes: PASS
- test_parse_sample_manifest_returns_nodes: PASS
- test_node_layers_assigned_correctly: PASS (stg_=staging, int_=intermediate, fct_/dim_=marts)
- test_edges_built_from_depends_on: PASS
- test_stats_calculated_correctly: PASS (12+ models, 5+ sources)
- test_source_nodes_detected: PASS (5 sources)

## Phase 2: TypeScript Typecheck
- `npm run typecheck` exits with code 0
- No TypeScript errors
- Fixed: useNodesState/useEdgesState generic types
- Fixed: vite-env.d.ts for import.meta.env

## Sample Manifest Validation
Nodes parsed: 19 total (5 sources + 5 staging + 3 intermediate + 4 marts + 2 exposures)
Edges built: DAG correctly links sources -> staging -> intermediate -> marts -> exposures
Test nodes: 7 test nodes (not_null, unique, relationships) correctly counted per model

## Backend API Validation
- GET /health returns {"status":"ok"}
- POST /api/manifest/upload returns GraphData with nodes, edges, stats
- GET /api/graph returns current loaded graph
- GET /api/models/:id returns individual node
- GET /api/lineage/:id returns ancestors/descendants/column_lineage
- POST /api/impact/:id returns impact scope + AI explanation placeholder

## Frontend Structure
All files created and TypeScript-valid:
- src/types/{graph,lineage,manifest}.ts
- src/services/apiService.ts
- src/store/explorerStore.ts (Zustand)
- src/components/graph/{DAGCanvas,ModelNode,SourceNode,GraphControls}.tsx
- src/components/detail/{ModelDetail,SQLViewer,ColumnList,TestResults,ModelDocs,ImpactAnalysis}.tsx
- src/components/sidebar/{StatsCard,LayerFilter,TagFilter,ModelList}.tsx
- src/components/layout/{AppLayout,Sidebar,Canvas,DetailPanel}.tsx
- src/components/upload/{UploadZone,SampleLoader}.tsx
- src/components/ui/{LayerBadge,TestBadge,SearchBar,Tooltip}.tsx
- src/pages/{Upload,Explorer}.tsx
