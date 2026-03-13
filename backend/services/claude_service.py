import os
from anthropic import Anthropic
from api.models.graph import GraphData

client = None


def get_client():
    global client
    if client is None:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if api_key:
            client = Anthropic(api_key=api_key)
    return client


async def explain_impact_analysis(
    changed_model: str,
    impact_scope: dict,
    graph_data: GraphData
) -> str:
    c = get_client()
    if not c:
        return "Claude AI is not configured. Add ANTHROPIC_API_KEY to enable impact analysis."

    system = """You are a senior Analytics Engineer explaining dbt data pipeline impact to a team. Be specific about WHY each downstream model is affected. Use clear business language."""

    user = f"""Model changed: {changed_model}
Impact scope:
- Direct children: {impact_scope['direct_children']}
- All descendants: {impact_scope['all_descendants']}
- Affected marts: {impact_scope['affected_marts']}
- Affected exposures: {impact_scope['affected_exposures']}
- Impact score: {impact_scope['impact_score']}/100

Explain in plain English:
1. What directly breaks (2-3 sentences)
2. What downstream business reports/dashboards are affected
3. What should be tested before deploying this change
4. Risk level: Low/Medium/High and why

Keep it concise and actionable."""

    try:
        response = c.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            messages=[{"role": "user", "content": user}],
            system=system
        )
        return response.content[0].text
    except Exception as e:
        return f"Impact analysis unavailable: {str(e)}"


async def explain_column_lineage(
    column_name: str,
    model_name: str,
    lineage_path: list[dict]
) -> str:
    c = get_client()
    if not c:
        return "Claude AI is not configured."

    try:
        response = c.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            messages=[{
                "role": "user",
                "content": f"Explain column '{column_name}' in model '{model_name}' lineage: {lineage_path}"
            }]
        )
        return response.content[0].text
    except Exception as e:
        return f"Column lineage explanation unavailable: {str(e)}"
