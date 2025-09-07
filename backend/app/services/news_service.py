import os
import requests

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

def fetch_career_news(query="internship jobs", limit=5):
    url = "https://google-news13.p.rapidapi.com/technology?lr=en-US"
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "google-news13.p.rapidapi.com"
    }
    params = {
        "q": query,
        "pageNumber": 1,
        "pageSize": limit,
        "autoCorrect": True
    }

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    data = response.json()
    print("DEBUG: Raw API response:", data)  # <-- debug print
    # Return the 'items' list directly from the API response
    return data.get("items", [])
