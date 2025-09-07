
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services.job_fetcher import fetch_jobs_serpapi
from app.services.skill_extractor import extract_skills_from_text   # <-- add this
from app.services.db import db

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/fetch")
def fetch_and_store_jobs(
    query: str = Query(..., description="Job keyword, e.g. 'Data Scientist'"),
    location: str = Query("India", description="Job location"),
    limit: int = Query(10, description="Number of jobs to fetch")
):
    try:
        jobs = fetch_jobs_serpapi(query, location, limit)
        if not jobs:
            raise HTTPException(status_code=404, detail="No jobs found")

        # Add extracted skills to each job
        for job in jobs:
             desc = job.get("description", "")
             highlights = " ".join(sum(job.get("job_highlights", []), [])) if job.get("job_highlights") else ""
             combined_text = desc + " " + highlights
             job["skills"] = extract_skills_from_text(combined_text)  # <-- skills extracted here
             job["skills_extracted"] = True if job["skills"] else False

        result = db.jobs.insert_many(jobs)

        return {
            "fetched": len(jobs),
            "inserted_ids": [str(i) for i in result.inserted_ids]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/list")
def list_jobs(limit: int = Query(20, ge=1, le=100, description="Max jobs to return")):
    try:
        jobs_cursor = db.jobs.find().limit(limit)
        jobs = []
        for job in jobs_cursor:
            job["_id"] = str(job["_id"])
            jobs.append(job)
        return {"jobs": jobs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))