from fastapi import APIRouter, HTTPException
from services.manifest_parser import get_current_graph
from api.models.graph import GraphNode

router = APIRouter()


@router.get("/models/{model_id:path}", response_model=GraphNode)
async def get_model(model_id: str):
    graph = get_current_graph()
    if not graph:
        raise HTTPException(404, "No manifest loaded")

    for node in graph.nodes:
        if node.id == model_id:
            return node

    raise HTTPException(404, f"Model {model_id} not found")
