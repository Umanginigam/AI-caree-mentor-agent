from fastapi import APIRouter, HTTPException
from app.services.matcher import match_resume_to_job

router = APIRouter(prefix="/match", tags=["Matching"])


@router.get("/{resume_id}/{job_id}")
def match_resume_job(resume_id: str, job_id: str):
    try:
        result = match_resume_to_job(resume_id, job_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
