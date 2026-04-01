from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from services.graph_service import build_networkx_graph, get_ancestors, get_descendants
from services.lineage_service import extract_column_lineage
from api.models.graph import GraphData
from api.models.response import LineageResult

router = APIRouter()


class LineageRequest(BaseModel):
    graph_data: GraphData
    nodes: list = Field(default_factory=list)
    edges: list = Field(default_factory=list)


@router.post("/lineage/{model_id:path}", response_model=LineageResult)
async def get_lineage(model_id: str, body: GraphData):
    G = build_networkx_graph(body)
    ancestors = get_ancestors(G, model_id)
    descendants = get_descendants(G, model_id)

    node = next((n for n in body.nodes if n.id == model_id), None)
    if not node:
        raise HTTPException(404, f"Model {model_id} not found")

    node_map = {n.id: n for n in body.nodes}
    column_lineage = extract_column_lineage(node, node_map)

    return LineageResult(
        model_id=model_id,
        ancestors=ancestors,
        descendants=descendants,
        column_lineage=column_lineage
    )
