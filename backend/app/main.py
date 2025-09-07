from fastapi import FastAPI
from app.api import resume, skills, jobs, match,roadmap,news 
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="AI Career Mentor API")

app.include_router(resume.router)
app.include_router(skills.router)
app.include_router(jobs.router)
app.include_router(match.router)
app.include_router(roadmap.router)
app.include_router(news.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Career Mentor API is running 🚀"}
