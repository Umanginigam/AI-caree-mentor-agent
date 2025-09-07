from typing import Dict, List, Tuple
from bson import ObjectId
from app.services.db import db


def compute_match(resume_skills: List[str], job_skills: List[str]) -> Dict:
    resume_set = set([s.lower() for s in resume_skills])
    job_set = set([s.lower() for s in job_skills])

    if not resume_set or not job_set:
        return {"match_percent": 0.0, "matched_skills": [], "skill_gap": list(job_set)}

    matched = resume_set.intersection(job_set)
    gap = job_set - resume_set

    match_percent = round(len(matched) / len(resume_set) * 100, 2)

    return {
        "match_percent": match_percent,
        "matched_skills": list(matched),
        "skill_gap": list(gap),
    }


def match_resume_to_job(resume_id: str, job_id: str) -> Dict:
    # fetch resume
    resume = db.resumes.find_one({"_id": ObjectId(resume_id)})
    if not resume:
        raise ValueError("Resume not found")

    # fetch job
    job = db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise ValueError("Job not found")

    resume_skills = resume.get("skills", [])
    job_skills = job.get("skills", [])

    result = compute_match(resume_skills, job_skills)

    return {
        "resume_id": str(resume["_id"]),
        "job_id": str(job["_id"]),
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        **result,
    }
