import networkx as nx
from api.models.graph import GraphData


def build_networkx_graph(graph_data: GraphData) -> nx.DiGraph:
    G = nx.DiGraph()
    for node in graph_data.nodes:
        G.add_node(node.id, **{
            "name": node.name,
            "type": node.type,
            "layer": node.layer
        })
    for edge in graph_data.edges:
        G.add_edge(edge.source, edge.target)
    return G


def get_ancestors(graph: nx.DiGraph, node_id: str) -> list[str]:
    if node_id not in graph:
        return []
    return list(nx.ancestors(graph, node_id))


def get_descendants(graph: nx.DiGraph, node_id: str) -> list[str]:
    if node_id not in graph:
        return []
    return list(nx.descendants(graph, node_id))


def get_direct_parents(graph: nx.DiGraph, node_id: str) -> list[str]:
    if node_id not in graph:
        return []
    return list(graph.predecessors(node_id))


def get_direct_children(graph: nx.DiGraph, node_id: str) -> list[str]:
    if node_id not in graph:
        return []
    return list(graph.successors(node_id))


def get_impact_scope(graph: nx.DiGraph, node_id: str, graph_data: GraphData) -> dict:
    if node_id not in graph:
        return {
            "direct_children": [],
            "all_descendants": [],
            "critical_path": [],
            "affected_marts": [],
            "affected_exposures": [],
            "impact_score": 0
        }

    direct_children = get_direct_children(graph, node_id)
    all_descendants = get_descendants(graph, node_id)

    # Build node lookup
    node_map = {n.id: n for n in graph_data.nodes}

    affected_marts = [
        d for d in all_descendants
        if d in node_map and node_map[d].layer == "marts"
    ]
    affected_exposures = [
        d for d in all_descendants
        if d in node_map and node_map[d].type == "exposure"
    ]

    # Critical path: longest downstream path
    critical_path = []
    try:
        max_len = 0
        for desc in all_descendants:
            try:
                path = nx.shortest_path(graph, node_id, desc)
                if len(path) > max_len:
                    max_len = len(path)
                    critical_path = path
            except nx.NetworkXNoPath:
                pass
    except Exception:
        pass

    # Impact score: 0-100 based on descendant count and affected marts/exposures
    total_nodes = len(graph_data.nodes)
    if total_nodes > 0:
        base_score = min(100, int(len(all_descendants) / total_nodes * 100))
        mart_bonus = min(30, len(affected_marts) * 10)
        exposure_bonus = min(20, len(affected_exposures) * 10)
        impact_score = min(100, base_score + mart_bonus + exposure_bonus)
    else:
        impact_score = 0

    return {
        "direct_children": direct_children,
        "all_descendants": all_descendants,
        "critical_path": critical_path,
        "affected_marts": affected_marts,
        "affected_exposures": affected_exposures,
        "impact_score": impact_score
    }


def get_shortest_path(graph: nx.DiGraph, source_id: str, target_id: str) -> list[str]:
    try:
        return nx.shortest_path(graph, source_id, target_id)
    except (nx.NetworkXNoPath, nx.NodeNotFound):
        return []
