from fastapi import APIRouter, HTTPException
from services.manifest_parser import get_current_graph
from services.graph_service import build_networkx_graph, get_ancestors, get_descendants
from services.lineage_service import extract_column_lineage
from api.models.response import LineageResult

router = APIRouter()


@router.get("/lineage/{model_id:path}", response_model=LineageResult)
async def get_lineage(model_id: str):
    graph_data = get_current_graph()
    if not graph_data:
        raise HTTPException(404, "No manifest loaded")

    G = build_networkx_graph(graph_data)
    ancestors = get_ancestors(G, model_id)
    descendants = get_descendants(G, model_id)

    # Get the node
    node = next((n for n in graph_data.nodes if n.id == model_id), None)
    if not node:
        raise HTTPException(404, f"Model {model_id} not found")

    node_map = {n.id: n for n in graph_data.nodes}
    column_lineage = extract_column_lineage(node, node_map)

    return LineageResult(
        model_id=model_id,
        ancestors=ancestors,
        descendants=descendants,
        column_lineage=column_lineage
    )
