from pydantic import BaseModel, Field
from typing import Optional, Any


class LineageResult(BaseModel):
    model_id: str
    ancestors: list[str] = Field(default_factory=list)
    descendants: list[str] = Field(default_factory=list)
    column_lineage: dict = Field(default_factory=dict)


class ImpactResult(BaseModel):
    model_id: str
    model_name: str
    direct_children: list[str] = Field(default_factory=list)
    all_descendants: list[str] = Field(default_factory=list)
    critical_path: list[str] = Field(default_factory=list)
    affected_marts: list[str] = Field(default_factory=list)
    affected_exposures: list[str] = Field(default_factory=list)
    impact_score: int = 0
    ai_explanation: Optional[str] = None
