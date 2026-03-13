from pydantic import BaseModel, Field
from typing import Optional


class GraphNode(BaseModel):
    id: str
    name: str
    type: str
    layer: str
    description: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    columns: dict = Field(default_factory=dict)
    compiled_sql: Optional[str] = None
    raw_sql: Optional[str] = None
    depends_on: list[str] = Field(default_factory=list)
    referenced_by: list[str] = Field(default_factory=list)
    test_count: int = 0
    test_results: list[dict] = Field(default_factory=list)
    materialization: str = "view"
    schema_name: Optional[str] = None
    database: Optional[str] = None


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    column_count: int = 0


class GraphData(BaseModel):
    nodes: list[GraphNode] = Field(default_factory=list)
    edges: list[GraphEdge] = Field(default_factory=list)
    stats: dict = Field(default_factory=dict)
