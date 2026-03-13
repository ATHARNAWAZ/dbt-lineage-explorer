from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import manifest, graph, models, lineage, impact, health
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="dbt Lineage Explorer API", version="1.0.0")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(manifest.router, prefix="/api")
app.include_router(graph.router, prefix="/api")
app.include_router(models.router, prefix="/api")
app.include_router(lineage.router, prefix="/api")
app.include_router(impact.router, prefix="/api")
