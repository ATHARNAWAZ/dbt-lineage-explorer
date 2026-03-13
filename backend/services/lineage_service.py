import re
from api.models.graph import GraphData, GraphNode


def extract_column_lineage(node: GraphNode, all_nodes: dict) -> dict:
    """Extract column-level lineage from compiled SQL."""
    lineage = {}

    sql = node.compiled_sql or node.raw_sql
    if not sql:
        return lineage

    # Basic SQL parsing for column lineage
    # Look for SELECT clause
    select_match = re.search(
        r'SELECT\s+(.*?)\s+FROM',
        sql,
        re.IGNORECASE | re.DOTALL
    )

    if not select_match:
        return lineage

    select_clause = select_match.group(1)

    # Find upstream models
    upstream_models = []
    for dep_id in node.depends_on:
        if dep_id in all_nodes:
            upstream_models.append(all_nodes[dep_id])

    # Simple column mapping
    for column_name, column_def in node.columns.items():
        lineage[column_name] = {
            "source_model": None,
            "source_column": column_name,
            "transformation": "direct",
            "description": column_def.get("description", "") if isinstance(column_def, dict) else ""
        }

        # Try to find source from upstream models
        for upstream in upstream_models:
            if column_name in upstream.columns:
                lineage[column_name]["source_model"] = upstream.name
                lineage[column_name]["source_column"] = column_name
                break

    return lineage
