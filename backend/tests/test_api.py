import pytest
import json
from pathlib import Path
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_upload_manifest_returns_200():
    sample_path = Path(__file__).parent.parent / "data" / "sample_manifest.json"
    with open(sample_path, "rb") as f:
        response = client.post(
            "/api/manifest/upload",
            files={"file": ("sample_manifest.json", f, "application/json")}
        )
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
    assert "stats" in data


def test_get_graph_after_upload():
    # First upload
    sample_path = Path(__file__).parent.parent / "data" / "sample_manifest.json"
    with open(sample_path, "rb") as f:
        client.post(
            "/api/manifest/upload",
            files={"file": ("sample_manifest.json", f, "application/json")}
        )

    response = client.get("/api/graph")
    assert response.status_code == 200
    data = response.json()
    assert len(data["nodes"]) > 0


def test_get_model_detail():
    sample_path = Path(__file__).parent.parent / "data" / "sample_manifest.json"
    with open(sample_path, "rb") as f:
        result = client.post(
            "/api/manifest/upload",
            files={"file": ("sample_manifest.json", f, "application/json")}
        )

    nodes = result.json()["nodes"]
    model_id = nodes[0]["id"]

    response = client.get(f"/api/models/{model_id}")
    assert response.status_code == 200
    assert response.json()["id"] == model_id


def test_impact_analysis_endpoint():
    sample_path = Path(__file__).parent.parent / "data" / "sample_manifest.json"
    with open(sample_path, "rb") as f:
        result = client.post(
            "/api/manifest/upload",
            files={"file": ("sample_manifest.json", f, "application/json")}
        )

    nodes = result.json()["nodes"]
    model_id = nodes[0]["id"]

    response = client.post(f"/api/impact/{model_id}")
    assert response.status_code == 200
    data = response.json()
    assert "impact_score" in data
    assert "direct_children" in data
