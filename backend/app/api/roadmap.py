from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.services.db import db
from app.services.roadmap_agent import generate_ai_roadmap, generate_skill_roadmap_agent
from app.services.matcher import match_resume_to_job

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

def normalize_skills(skills):
    """Flatten nested lists & clean strings"""
    flat = []
    for s in skills:
        if isinstance(s, list):
            flat.extend(normalize_skills(s))  # recursive flatten
        elif isinstance(s, str):
            clean_s = s.strip().lower()
            if clean_s:
                flat.append(clean_s)
    return flat

@router.get("/ai/{resume_id}/{job_id}")
def get_ai_roadmap(resume_id: str, job_id: str):
    try:
        print("📌 Incoming resume_id:", resume_id)
        print("📌 Incoming job_id:", job_id)

        # Convert to ObjectId safely
        try:
            resume_oid = ObjectId(resume_id)
            job_oid = ObjectId(job_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid resume_id or job_id")

        # Fetch documents from MongoDB
        resume = db.resumes.find_one({"_id": resume_oid})
        job = db.jobs.find_one({"_id": job_oid})

        print("📌 Resume found:", resume)
        print("📌 Job found:", job)

        if not resume or not job:
            raise HTTPException(status_code=404, detail="Resume or Job not found")

        # Normalize skills
        resume_skills = normalize_skills(resume.get("skills", []))
        job_skills = normalize_skills(job.get("skills", []))

        if not resume_skills or not job_skills:
            raise HTTPException(status_code=400, detail="Skills must not be empty")

        # Match skills
        result = match_resume_to_job(resume_skills, job_skills)

        matched_skills = [str(s) for s in result["matched_skills"]]
        missing_skills = [str(s) for s in result["missing_skills"]]

        # Generate AI roadmap
        ai_plan = generate_ai_roadmap(
            job_title=job.get("title", "Unknown Role"),
            existing_skills=matched_skills,
            missing_skills=missing_skills
        )

        return {
            "resume_id": resume_id,
            "job_id": job_id,
            "job_title": job.get("title", "Unknown Role"),
            "match_percentage": result.get("match_percentage", 0),
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "ai_roadmap": ai_plan
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print("🔥 ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/skill")
def generate_skill_roadmap(payload: dict):
    """Generate a detailed roadmap for a specific skill using AI.
    Expects JSON: { resume_id, job_id, skill }
    Returns structured JSON with sections: videos, day_plan, blogs, notes, summary
    """
    resume_id = payload.get("resume_id")
    job_id = payload.get("job_id")
    skill = payload.get("skill")

    if not skill:
        raise HTTPException(status_code=400, detail="Missing 'skill' in request body")

    # Minimal validation for resume/job presence (optional)
    try:
        if resume_id:
            _ = db.resumes.find_one({"_id": ObjectId(resume_id)})
        if job_id:
            _ = db.jobs.find_one({"_id": ObjectId(job_id)})
    except Exception:
        # Ignore missing resources; roadmap can still be generated based only on skill
        pass

    try:
        detail = generate_skill_roadmap_agent(skill)
        return {"skill": skill, "detail": detail}
    except Exception as e:
        print("🔥 ERROR generating skill roadmap:", e)
        raise HTTPException(status_code=500, detail=str(e))
