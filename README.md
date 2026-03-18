# dbt-lineage-explorer

> Understand your dbt project in minutes, not weeks.

An interactive DAG explorer for dbt projects. Upload your `manifest.json` and get a visual, clickable lineage graph with model details, column info, test results, and AI-powered impact analysis.

Built because onboarding to a new dbt project shouldn't take 3 weeks of reading YAML files.

---

## The Problem

You join a new data team. There's a dbt project with 80 models.
Nobody documented anything properly.
You spend days just figuring out what depends on what.

This fixes that.

---

## What It Does

- Upload your dbt `manifest.json` → instant interactive DAG
- Click any model → see its SQL, columns, tests, and upstream/downstream deps
- Search and filter by layer (staging, intermediate, marts, sources)
- Ask the AI — "what breaks if I change the orders model?" → get a real answer
- Column-level lineage — trace a single field through the entire pipeline

---

## Quick Start

```bash
git clone https://github.com/ATHARNAWAZ/dbt-lineage-explorer
cd dbt-lineage-explorer
docker-compose up
```

Open http://localhost:3000 — upload your manifest.json and you're in.

Don't have a manifest.json handy? There's a sample one in `/sample_data/` based on a fintech pipeline.

---

## Stack

**Backend:** Python · FastAPI · NetworkX · PyIceberg · Anthropic Claude API
**Frontend:** React 18 · TypeScript · React Flow (@xyflow/react) · Monaco Editor · Tailwind · Zustand
**Infra:** Docker · GitHub Actions

---

## How To Generate Your manifest.json

```bash
# in your dbt project
dbt compile

# manifest.json will be at
./target/manifest.json
```

Upload that file to the explorer and you're done.

---

## Features

| Feature | Status |
|---|---|
| Interactive DAG with zoom/pan | ✅ |
| Node colours by layer (staging/int/marts/source) | ✅ |
| Click model → SQL + columns + tests | ✅ |
| Search and filter sidebar | ✅ |
| AI impact analysis (Claude API) | ✅ |
| Column-level lineage | ✅ |
| Sample fintech manifest included | ✅ |
| Dark mode | ✅ |

---

## Environment Variables

```env
ANTHROPIC_API_KEY=your_key_here
```

That's it. No other config needed for local development.

---

## Sample Data

The repo includes a sample `manifest.json` for a fictional fintech pipeline:

- 5 source tables (transactions, customers, products, events, sessions)
- 5 staging models
- 3 intermediate models
- 4 mart models
- 2 exposures

Good for testing the explorer without connecting your own project.

---

## Known Issues

- Large manifests (500+ models) can be slow to render on first load
- Column-level lineage only works if your dbt models have column descriptions in schema.yml
- AI analysis requires an Anthropic API key

---

## Roadmap

- [ ] dbt Cloud integration (pull manifest automatically)
- [ ] Export lineage as PNG/SVG
- [ ] Slack notifications when model structure changes
- [ ] Multi-project support

---

## Why I Built This

I was onboarding to a new data project and spent an entire week just drawing lineage diagrams on paper. There had to be a better way.

There are commercial tools that do this. They cost $30k/year.
This is free and runs locally in one command.

---

## License

MIT — do whatever you want with it.

---

Built by [ATHARNAWAZ](https://github.com/ATHARNAWAZ) · [LinkedIn](https://linkedin.com/in/atharnawaz)
