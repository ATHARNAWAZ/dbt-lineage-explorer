import sys
import os

# Ensure backend/ is on the path regardless of how Vercel sets cwd
_backend_dir = os.path.dirname(os.path.abspath(__file__))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

import traceback
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="dbt Lineage Explorer API", version="1.0.0")

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

_startup_error: str | None = None

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
        "backend_dir": _backend_dir,
        "python": sys.version,
        "files": os.listdir(_backend_dir) if os.path.exists(_backend_dir) else [],
    }
