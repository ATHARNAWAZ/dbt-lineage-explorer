from fastapi import APIRouter, UploadFile, File, HTTPException
from services.manifest_parser import parse_manifest, load_sample_manifest
from api.models.graph import GraphData
import json

router = APIRouter()


@router.post("/manifest/upload", response_model=GraphData)
async def upload_manifest(file: UploadFile = File(...)):
    if not file.filename.endswith(".json"):
        raise HTTPException(400, "File must be a JSON file")

    content = await file.read()
    try:
        manifest_json = json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(400, "Invalid JSON file")

    if "nodes" not in manifest_json and "sources" not in manifest_json:
        raise HTTPException(400, "Invalid dbt manifest: missing nodes or sources")

    try:
        graph_data = parse_manifest(manifest_json)
        return graph_data
    except Exception as e:
        raise HTTPException(500, f"Failed to parse manifest: {str(e)}")


@router.get("/manifest/sample", response_model=GraphData)
async def load_sample():
    try:
        return load_sample_manifest()
    except Exception as e:
        raise HTTPException(500, f"Failed to load sample: {str(e)}")
