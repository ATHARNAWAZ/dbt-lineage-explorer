from fastapi import APIRouter, HTTPException
from services.manifest_parser import get_current_graph
from services.graph_service import build_networkx_graph, get_impact_scope
from services.claude_service import explain_impact_analysis
from api.models.response import ImpactResult

router = APIRouter()


@router.post("/impact/{model_id:path}", response_model=ImpactResult)
async def analyze_impact(model_id: str):
    graph_data = get_current_graph()
    if not graph_data:
        raise HTTPException(404, "No manifest loaded")

    G = build_networkx_graph(graph_data)
    node = next((n for n in graph_data.nodes if n.id == model_id), None)
    if not node:
        raise HTTPException(404, f"Model {model_id} not found")

    scope = get_impact_scope(G, model_id, graph_data)
    ai_explanation = await explain_impact_analysis(node.name, scope, graph_data)

    return ImpactResult(
        model_id=model_id,
        model_name=node.name,
        direct_children=scope["direct_children"],
        all_descendants=scope["all_descendants"],
        critical_path=scope["critical_path"],
        affected_marts=scope["affected_marts"],
        affected_exposures=scope["affected_exposures"],
        impact_score=scope["impact_score"],
        ai_explanation=ai_explanation
    )
