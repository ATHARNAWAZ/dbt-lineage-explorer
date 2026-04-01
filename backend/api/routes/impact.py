from fastapi import APIRouter, HTTPException
from services.graph_service import build_networkx_graph, get_impact_scope
from services.claude_service import explain_impact_analysis
from api.models.graph import GraphData
from api.models.response import ImpactResult

router = APIRouter()


@router.post("/impact/{model_id:path}", response_model=ImpactResult)
async def analyze_impact(model_id: str, body: GraphData):
    G = build_networkx_graph(body)
    node = next((n for n in body.nodes if n.id == model_id), None)
    if not node:
        raise HTTPException(404, f"Model {model_id} not found")

    scope = get_impact_scope(G, model_id, body)
    ai_explanation = await explain_impact_analysis(node.name, scope, body)

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
