# dbt Lineage Explorer

> Visualize, explore and understand your entire dbt project — locally or in the cloud.

**Live Demo → [dbt-lineage-explorer.vercel.app](https://dbt-lineage-explorer.vercel.app)**  
**GitHub → [github.com/ATHARNAWAZ/dbt-lineage-explorer](https://github.com/ATHARNAWAZ/dbt-lineage-explorer)**

---

## What it does

Upload your `manifest.json` and instantly get an interactive graph of your entire dbt pipeline.

- **Interactive DAG** — zoom, pan, click any model to inspect it
- **SQL Viewer** — Monaco editor with full syntax highlighting
- **Column Lineage** — trace any column back to its raw source
- **AI Impact Analysis** — Claude explains what breaks downstream before you ship
- **Tests & Docs** — see test results and schema.yml docs side-by-side
- **Works locally** — no data leaves your machine (except AI calls if enabled)

---

## Architecture

```
manifest.json → FastAPI → NetworkX → React Flow DAG
                    ↓
              Claude API (optional)
                    ↓
            Impact Analysis Report
```

| Layer | Tech |
|-------|------|
| Backend | Python 3.11, FastAPI, NetworkX, Pydantic |
| Frontend | React 18, TypeScript, React Flow, Monaco Editor |
| AI | Anthropic Claude (optional) |
| Deploy | Vercel (serverless, stateless) |

---

## Quick Start (5 commands)

```bash
git clone https://github.com/ATHARNAWAZ/dbt-lineage-explorer
cd dbt-lineage-explorer/backend
python -m venv venv && .\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Then in a second terminal:
```bash
cd dbt-lineage-explorer/frontend
npm install && npm run dev
```

Open **http://localhost:5173** — click **"Load sample project"** to explore immediately. No setup required.

---

## Configuration

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your key:
ANTHROPIC_API_KEY=sk-ant-...
```

AI impact analysis works without a key — it shows graph-based results only. Add the key for Claude's plain-English explanation.

---

## Vercel Deployment

Deployed at **[dbt-lineage-explorer.vercel.app](https://dbt-lineage-explorer.vercel.app)**

The backend runs as Python serverless functions (stateless). All graph operations — lineage, impact scope, model lookup — send graph context per-request, so no in-memory state is needed.

To deploy your own fork:
```bash
npx vercel --prod
```

Add `ANTHROPIC_API_KEY` in Vercel → Project Settings → Environment Variables.

---

## Project Structure

```
dbt-lineage-explorer/
├── backend/                       # FastAPI + NetworkX
│   ├── api/
│   │   ├── routes/                # manifest, graph, lineage, impact
│   │   └── models/                # Pydantic schemas
│   ├── services/
│   │   ├── manifest_parser.py     # dbt manifest → GraphData
│   │   ├── graph_service.py       # NetworkX traversal
│   │   ├── lineage_service.py     # Column lineage extraction
│   │   └── claude_service.py      # Claude AI integration
│   └── data/sample_manifest.json  # Fintech demo pipeline
└── frontend/                      # React + TypeScript
    └── src/
        ├── components/
        │   ├── graph/             # React Flow DAG + custom nodes
        │   ├── detail/            # SQL, Columns, Tests, Impact panels
        │   └── sidebar/           # Search, filters, stats
        ├── pages/                 # Upload, Explorer
        └── store/                 # Zustand state
```

---

## Node Colors

| Layer | Color | Naming |
|-------|-------|--------|
| Source | Grey `#718096` | raw_ tables |
| Staging | Blue `#4299e1` | stg_ |
| Intermediate | Purple `#9f7aea` | int_ |
| Marts | Green `#48bb78` | fct_ / dim_ |
| Exposure | Orange `#ed8936` | dashboards |

---

## Tests

```bash
cd backend
.\venv\Scripts\activate
pytest tests/ -v   # 14 tests, all pass
```

---

## License

MIT
