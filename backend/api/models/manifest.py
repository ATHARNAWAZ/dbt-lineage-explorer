from pydantic import BaseModel, Field
from typing import Optional


class DbtNode(BaseModel):
    unique_id: str
    name: str
    resource_type: str
    path: str = ""
    original_file_path: str = ""
    compiled_code: Optional[str] = None
    raw_code: Optional[str] = None
    depends_on: dict = Field(default_factory=dict)
    refs: list = Field(default_factory=list)
    sources: list = Field(default_factory=list)
    columns: dict = Field(default_factory=dict)
    description: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    config: dict = Field(default_factory=dict)
    fqn: list[str] = Field(default_factory=list)
    database: Optional[str] = None
    schema_: Optional[str] = Field(None, alias="schema")
    alias: Optional[str] = None

    model_config = {"populate_by_name": True}


class DbtManifest(BaseModel):
    metadata: dict
    nodes: dict[str, DbtNode] = Field(default_factory=dict)
    sources: dict[str, DbtNode] = Field(default_factory=dict)
    exposures: Optional[dict] = None
    metrics: Optional[dict] = None
