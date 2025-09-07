# backend/app/api/resume.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.db import db
from app.services.parser import extract_text_from_file
from app.services.skill_extractor import extract_skills_from_text  # <-- add this

import os
from bson import ObjectId

router = APIRouter(prefix="/resume", tags=["Resume"])


UPLOAD_DIR = "/app/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        # Save file locally inside container
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Extract text from resume
        text = extract_text_from_file(file_path)

        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume")

        # Extract skills automatically
        skills = extract_skills_from_text(text)

        # Save to MongoDB
        resume_doc = {
            "filename": file.filename,
            "text": text,
            "skills": skills,
            "skills_extracted": True if skills else False,
        }
        result = db.resumes.insert_one(resume_doc)

        return {
            "resume_id": str(result.inserted_id),
            "filename": file.filename,
            "skills": skills,
            "count": len(skills),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
