from fastapi import APIRouter, HTTPException
from services.manifest_parser import get_current_graph
from api.models.graph import GraphData

router = APIRouter()


@router.get("/graph", response_model=GraphData)
async def get_graph():
    graph = get_current_graph()
    if not graph:
        raise HTTPException(404, "No manifest loaded. Upload a manifest first.")
    return graph
