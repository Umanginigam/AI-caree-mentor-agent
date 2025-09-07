import os
from serpapi import GoogleSearch
from typing import List, Dict

SERPAPI_KEY = os.getenv("SERPAPI_KEY")  # add this to your .env


def fetch_jobs_serpapi(query: str, location: str, limit: int = 10) -> List[Dict]:
    """Fetch jobs using SerpAPI (Google Jobs engine)."""
    jobs = []

    search = GoogleSearch({
        "engine": "google_jobs",
        "q": query,
        "location": location,
        "hl": "en",
        "api_key": SERPAPI_KEY,
    })

    results = search.get_dict()
    if "jobs_results" not in results:
        return []

    for job in results["jobs_results"][:limit]:
        jobs.append({
            "title": job.get("title"),
            "company": job.get("company_name"),
            "location": job.get("location"),
            "via": job.get("via"),
            "description": job.get("description"),
            "job_highlights": job.get("job_highlights", []),
            "extensions": job.get("extensions", []),
            "link": job.get("apply_options", [{}])[0].get("link"),
            "source": "serpapi",
        })

    return jobs
