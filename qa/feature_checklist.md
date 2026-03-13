# Feature Checklist

## Backend
- [x] FastAPI app with CORS configured
- [x] POST /api/manifest/upload - parse dbt manifest.json
- [x] GET /api/manifest/sample - load sample fintech manifest
- [x] GET /api/graph - retrieve current graph data
- [x] GET /api/models/:id - get single model detail
- [x] GET /api/lineage/:id - ancestors, descendants, column lineage
- [x] POST /api/impact/:id - impact analysis with AI explanation
- [x] GET /health - health check
- [x] Manifest parser with layer detection (stg/int/fct/dim/source/exposure)
- [x] NetworkX graph service with ancestors/descendants/impact scope
- [x] Column lineage extraction from SQL
- [x] Claude AI service (gracefully no-ops without API key)
- [x] Sample manifest: 19 nodes fintech pipeline
- [x] All 14 pytest tests passing

## Frontend
- [x] React 18 + TypeScript + Vite
- [x] Tailwind CSS with dbt design tokens
- [x] React Flow DAG with dagre auto-layout
- [x] Custom ModelNode (layer color bar, tests, columns, materialization)
- [x] Custom SourceNode (grey, database/schema info)
- [x] Ancestor/descendant highlighting on node click
- [x] Dimmed nodes when selection active
- [x] Zustand store for global state
- [x] Upload page with drag-and-drop zone
- [x] Sample project loader
- [x] Explorer page with 3-panel layout
- [x] Sidebar: stats card, search, layer filter, tag filter, model list
- [x] Detail panel: animated slide-in with Framer Motion
- [x] ModelDetail with 5 tabs (Overview, SQL, Columns, Tests, Impact)
- [x] Monaco SQL editor (read-only, dark theme, copy button)
- [x] Column list with expandable rows
- [x] Test results with summary bar
- [x] Impact analysis with score circle, affected sections, AI explanation, copy report
- [x] ModelDocs with metadata, tags, depends_on, referenced_by
- [x] TypeScript typecheck passes (0 errors)

## Infrastructure
- [x] docker-compose.yml
- [x] backend/Dockerfile
- [x] frontend/Dockerfile
- [x] .gitignore
- [x] .env.example files
