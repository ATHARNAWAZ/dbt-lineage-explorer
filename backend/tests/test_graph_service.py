import pytest
import json
from pathlib import Path
from services.manifest_parser import parse_manifest
from services.graph_service import (
    build_networkx_graph, get_ancestors, get_descendants,
    get_impact_scope, get_shortest_path
)


@pytest.fixture
def graph_data():
    sample_path = Path(__file__).parent.parent / "data" / "sample_manifest.json"
    with open(sample_path) as f:
        manifest = json.load(f)
    return parse_manifest(manifest)


@pytest.fixture
def nx_graph(graph_data):
    return build_networkx_graph(graph_data)


def test_ancestors_of_fct_orders(graph_data, nx_graph):
    fct_orders = next((n for n in graph_data.nodes if n.name == "fct_orders"), None)
    assert fct_orders is not None
    ancestors = get_ancestors(nx_graph, fct_orders.id)
    # fct_orders should have upstream staging models
    assert len(ancestors) > 0


def test_descendants_of_stg_orders(graph_data, nx_graph):
    stg_orders = next((n for n in graph_data.nodes if n.name == "stg_orders"), None)
    assert stg_orders is not None
    descendants = get_descendants(nx_graph, stg_orders.id)
    assert len(descendants) > 0


def test_impact_scope_returns_all_fields(graph_data, nx_graph):
    stg_orders = next((n for n in graph_data.nodes if n.name == "stg_orders"), None)
    assert stg_orders is not None
    scope = get_impact_scope(nx_graph, stg_orders.id, graph_data)
    assert "direct_children" in scope
    assert "all_descendants" in scope
    assert "critical_path" in scope
    assert "affected_marts" in scope
    assert "affected_exposures" in scope
    assert "impact_score" in scope


def test_shortest_path_between_nodes(graph_data, nx_graph):
    stg_orders = next((n for n in graph_data.nodes if n.name == "stg_orders"), None)
    fct_orders = next((n for n in graph_data.nodes if n.name == "fct_orders"), None)
    assert stg_orders and fct_orders
    path = get_shortest_path(nx_graph, stg_orders.id, fct_orders.id)
    assert len(path) >= 2
