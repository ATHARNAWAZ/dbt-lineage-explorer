import json
from pathlib import Path
from api.models.manifest import DbtManifest, DbtNode
from api.models.graph import GraphData, GraphNode, GraphEdge

_current_manifest: DbtManifest | None = None
_current_graph: GraphData | None = None


def determine_layer(node: DbtNode) -> str:
    if node.resource_type == "source":
        return "source"
    if node.resource_type == "exposure":
        return "exposure"
    name = node.name.lower()
    if name.startswith("stg_"):
        return "staging"
    if name.startswith("int_"):
        return "intermediate"
    if name.startswith("fct_") or name.startswith("dim_"):
        return "marts"
    return "other"


def parse_manifest(manifest_json: dict) -> GraphData:
    manifest = DbtManifest.model_validate(manifest_json)

    all_nodes_raw = {**manifest.nodes, **manifest.sources}
    if manifest.exposures:
        all_nodes_raw.update(manifest.exposures)

    # Count tests per model
    test_counts: dict[str, int] = {}
    test_results: dict[str, list] = {}
    for node_id, node_data in manifest.nodes.items():
        if isinstance(node_data, dict):
            rt = node_data.get("resource_type", "")
        else:
            rt = node_data.resource_type
        if rt == "test":
            # find which model this test is for
            if isinstance(node_data, dict):
                deps = node_data.get("depends_on", {}).get("nodes", [])
                test_name = node_data.get("name", "")
                test_status = node_data.get("status", "pass")
            else:
                deps = node_data.depends_on.get("nodes", [])
                test_name = node_data.name
                test_status = "pass"
            for dep in deps:
                if dep.startswith("model.") or dep.startswith("source."):
                    test_counts[dep] = test_counts.get(dep, 0) + 1
                    if dep not in test_results:
                        test_results[dep] = []
                    test_results[dep].append({
                        "name": test_name,
                        "status": test_status,
                        "column": ""
                    })

    # Build referenced_by map
    referenced_by: dict[str, list[str]] = {}
    for node_id, node_data in all_nodes_raw.items():
        if isinstance(node_data, dict):
            rt = node_data.get("resource_type", "")
            deps = node_data.get("depends_on", {}).get("nodes", [])
        else:
            rt = node_data.resource_type
            deps = node_data.depends_on.get("nodes", [])
        if rt == "test":
            continue
        for dep in deps:
            if dep not in referenced_by:
                referenced_by[dep] = []
            if node_id not in referenced_by[dep]:
                referenced_by[dep].append(node_id)

    # Build graph nodes
    graph_nodes = []
    for node_id, node_data in all_nodes_raw.items():
        if isinstance(node_data, dict):
            rt = node_data.get("resource_type", "")
        else:
            rt = node_data.resource_type
        if rt == "test":
            continue

        try:
            if isinstance(node_data, dict):
                node = DbtNode.model_validate(node_data)
            else:
                node = node_data
        except Exception:
            continue

        layer = determine_layer(node)
        deps = node.depends_on.get("nodes", [])
        # Filter out test dependencies
        model_deps = [d for d in deps if not d.startswith("test.")]

        graph_node = GraphNode(
            id=node.unique_id,
            name=node.name,
            type=node.resource_type,
            layer=layer,
            description=node.description,
            tags=node.tags,
            columns=node.columns,
            compiled_sql=node.compiled_code,
            raw_sql=node.raw_code,
            depends_on=model_deps,
            referenced_by=referenced_by.get(node.unique_id, []),
            test_count=test_counts.get(node.unique_id, 0),
            test_results=test_results.get(node.unique_id, []),
            materialization=node.config.get("materialized", "view"),
            schema_name=node.schema_,
            database=node.database
        )
        graph_nodes.append(graph_node)

    # Build edges
    edges = []
    edge_set = set()
    for node in graph_nodes:
        for dep_id in node.depends_on:
            edge_key = f"{dep_id}->{node.id}"
            if edge_key not in edge_set:
                edge_set.add(edge_key)
                edges.append(GraphEdge(
                    id=f"edge-{dep_id}-{node.id}",
                    source=dep_id,
                    target=node.id,
                    column_count=0
                ))

    # Calculate stats
    models = [n for n in graph_nodes if n.type == "model"]
    sources = [n for n in graph_nodes if n.type == "source"]
    exposures = [n for n in graph_nodes if n.type == "exposure"]

    total_tests = sum(n.test_count for n in graph_nodes)
    models_with_tests = sum(1 for n in models if n.test_count > 0)
    test_coverage = round(models_with_tests / len(models) * 100) if models else 0

    models_by_layer = {}
    for n in graph_nodes:
        models_by_layer[n.layer] = models_by_layer.get(n.layer, 0) + 1

    stats = {
        "total_models": len(models),
        "total_sources": len(sources),
        "total_exposures": len(exposures),
        "total_tests": total_tests,
        "test_coverage_pct": test_coverage,
        "models_by_layer": models_by_layer
    }

    global _current_manifest, _current_graph
    _current_manifest = manifest
    graph_data = GraphData(nodes=graph_nodes, edges=edges, stats=stats)
    _current_graph = graph_data
    return graph_data


def get_current_graph() -> GraphData | None:
    return _current_graph


def load_sample_manifest() -> GraphData:
    sample_path = Path(__file__).parent.parent / "data" / "sample_manifest.json"
    with open(sample_path) as f:
        data = json.load(f)
    return parse_manifest(data)
