# backend/app/api/skills.py
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.services.db import db
from app.services.skill_extractor import extract_skills_from_text

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.post("/extract/{resume_id}")
def extract_skills(resume_id: str):
    try:
        # fetch resume
        resume = db.resumes.find_one({"_id": ObjectId(resume_id)})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        text = resume.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="Resume has no extracted text")

        skills = extract_skills_from_text(text)

        # update resume doc
        db.resumes.update_one(
            {"_id": ObjectId(resume_id)},
            {"$set": {"skills": skills, "skills_extracted": True}}
        )

        return {"resume_id": resume_id, "skills": skills, "count": len(skills)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
