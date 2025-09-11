from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AlertType(str, Enum):
    LOG = "log"
    METRIC = "metric"
    SECURITY = "security"

class Alert(BaseModel):
    id: str
    ruleType: str
    message: str
    service: str
    severity: str
    status: str
    payload: Dict[str, Any]
    createdAt: str
    updatedAt: str

class Solution(BaseModel):
    id: str
    alert_type: AlertType
    problem_pattern: str
    solution_steps: List[str]
    effectiveness_score: int = Field(ge=0, le=100)
    service: Optional[str] = None
    severity: Optional[str] = None
    rule_type: Optional[str] = None
    created_at: Optional[str] = None
    times_used: int = 0

class AnalysisRequest(BaseModel):
    alert: Alert
    tried_solutions: Optional[List[str]] = []

class AnalysisResponse(BaseModel):
    solutions: List[Solution]
    source: str  # "knowledge_base" or "ai"
    alert_type: str

class SolutionFeedback(BaseModel):
    alert: Alert
    solution: Solution
    worked: bool
    comments: Optional[str] = None

class AddSolutionRequest(BaseModel):
    alert: Alert
    problem_pattern: str
    solution_steps: List[str]
    expected_outcome: Optional[str] = None
    keywords: Optional[List[str]] = None