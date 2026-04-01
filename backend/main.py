import os
import sys
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="dbt Lineage Explorer API", version="1.0.0")

_startup_error: str | None = None

# CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
allowed_origins = [o.strip() for o in allowed_origins]
use_credentials = "*" not in allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=use_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load routes — catch import errors so we can report them via /debug
try:
    from api.routes import manifest, graph, models, lineage, impact, health
    app.include_router(health.router)
    app.include_router(manifest.router, prefix="/api")
    app.include_router(graph.router, prefix="/api")
    app.include_router(models.router, prefix="/api")
    app.include_router(lineage.router, prefix="/api")
    app.include_router(impact.router, prefix="/api")
except Exception:
    _startup_error = traceback.format_exc()


@app.get("/debug")
def debug_info():
    return {
        "startup_error": _startup_error,
        "sys_path": sys.path,
        "cwd": os.getcwd(),
        "python": sys.version,
    }
