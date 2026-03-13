import pytest
import json
from pathlib import Path
from services.manifest_parser import parse_manifest


@pytest.fixture
def sample_manifest():
    sample_path = Path(__file__).parent.parent / "data" / "sample_manifest.json"
    with open(sample_path) as f:
        return json.load(f)


def test_parse_sample_manifest_returns_nodes(sample_manifest):
    result = parse_manifest(sample_manifest)
    assert len(result.nodes) > 0


def test_node_layers_assigned_correctly(sample_manifest):
    result = parse_manifest(sample_manifest)
    node_map = {n.name: n for n in result.nodes}
    assert node_map["stg_orders"].layer == "staging"
    assert node_map["int_orders_enriched"].layer == "intermediate"
    assert node_map["fct_orders"].layer == "marts"


def test_edges_built_from_depends_on(sample_manifest):
    result = parse_manifest(sample_manifest)
    assert len(result.edges) > 0


def test_stats_calculated_correctly(sample_manifest):
    result = parse_manifest(sample_manifest)
    assert result.stats["total_models"] >= 12
    assert result.stats["total_sources"] >= 5


def test_source_nodes_detected(sample_manifest):
    result = parse_manifest(sample_manifest)
    sources = [n for n in result.nodes if n.type == "source"]
    assert len(sources) >= 5
