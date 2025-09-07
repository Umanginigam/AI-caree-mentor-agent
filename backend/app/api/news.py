from fastapi import APIRouter, Query
from app.services.news_service import fetch_career_news

router = APIRouter(prefix="/news", tags=["News"])

@router.get("/")
def get_career_news(query: str = Query("internship jobs", description="Search keyword"),
                    limit: int = Query(5, ge=1, le=20, description="Number of results")):
    return fetch_career_news(query, limit)
