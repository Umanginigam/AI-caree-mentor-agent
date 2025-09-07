# backend/app/models/resume_model.py
from pydantic import BaseModel
from typing import List, Optional

class Resume(BaseModel):
    name: str
    file_name: str
    text: str
    skills: Optional[List[str]] = []
