# backend/app/services/job_parser.py
import re

def extract_skills_from_job(description: str) -> list:
    # A simple predefined skill set (expand this as needed)
    skill_keywords = [
        "python", "java", "c++", "sql", "mongodb", "flask", "django",
        "react", "node.js", "tensorflow", "keras", "pytorch",
        "aws", "gcp", "azure", "docker", "kubernetes",
        "nlp", "computer vision", "machine learning", "deep learning"
    ]
    
    # Normalize description
    text = description.lower()
    
    # Extract skills
    found = [skill for skill in skill_keywords if skill in text]
    return list(set(found))
