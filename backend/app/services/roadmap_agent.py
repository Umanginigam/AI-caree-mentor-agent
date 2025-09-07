import os
from openai import OpenAI  

# Use GitHub ChatGPT token + Azure inference endpoint
client = OpenAI(
    api_key=os.getenv("GITHUB_TOKEN"),
    base_url="https://models.inference.ai.azure.com"
)

def generate_ai_roadmap(job_title, existing_skills, missing_skills):
    prompt = f"""
    You are an AI career mentor.
    A student wants to become a {job_title}.

    ✅ Current skills: {existing_skills}
    ❌ Missing skills: {missing_skills}

    Please create a step-by-step roadmap for the student:
    - Order the missing skills logically.
    - Suggest learning resources (courses, docs, projects).
    - Estimate learning time (short/medium/long).
    - Keep tone motivating and simple.
    """

    # ✅ Debug log
    print("📌 --- AI Roadmap Prompt ---")
    print(prompt)
    print("📌 -------------------------")

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",   # you can try "gpt-4o" if enabled
            messages=[
                {"role": "system", "content": "You are a career guidance AI."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=400
        )

        roadmap = response.choices[0].message.content.strip()
        print("📌 --- AI Roadmap Response ---")
        print(roadmap)
        print("📌 ----------------------------")

        return roadmap

    except Exception as e:
        print("🔥 ERROR in generate_ai_roadmap:", str(e))
        return "⚠️ Roadmap generation failed."


def generate_skill_roadmap_agent(skill_name: str):
    """Generate a skill-focused detailed roadmap. Returns structured dict with keys:
    - summary: short text
    - videos: list of {title, url, duration}
    - day_plan: list of days with tasks
    - blogs: list of {title, url}
    - notes: short bullet points

    Attempts to parse JSON from the model; if parsing fails returns text under 'summary'.
    """
    prompt = f"""
    You are a helpful career mentor and curriculum designer.
    Produce a JSON object (no additional text) with the following keys:
    - summary: short paragraph describing the learning goal for '{skill_name}'.
    - videos: an array of up to 3 video resources with keys title,url,duration.
    - day_plan: an ordered array of days (day 1..n) each with tasks (short list) and estimated minutes.
    - blogs: up to 3 blog/article resources with title,url.
    - notes: short bullet points / tips.

    Keep responses concise. If you cannot provide a field leave it as an empty array or empty string.
    """

    print("📌 --- Skill Roadmap Prompt ---")
    print(prompt)
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a practical curriculum designer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=600
        )

        raw = response.choices[0].message.content.strip()
        print("📌 --- Skill Roadmap Raw Response ---")
        print(raw)

        # Try to parse JSON from the model output
        import json
        # Clean common wrappers (triple backticks, ```json, etc.) before parsing
        clean = raw
        # Remove surrounding ``` fences if present
        if clean.startswith('```') and clean.endswith('```'):
            # remove the outer fences and optional language tag
            # drop first fence line
            parts = clean.split('\n')
            # if first line is like ```json, drop it
            if parts[0].strip().startswith('```'):
                parts = parts[1:]
            # if last line is fence, drop it
            if parts and parts[-1].strip().startswith('```'):
                parts = parts[:-1]
            clean = '\n'.join(parts).strip()

        # Try to find the first { and last } to extract JSON substring
        if ('{' in clean) and ('}' in clean):
            first = clean.find('{')
            last = clean.rfind('}')
            if first != -1 and last != -1 and last > first:
                json_sub = clean[first:last+1]
            else:
                json_sub = clean
        else:
            json_sub = clean

        try:
            parsed = json.loads(json_sub)
            return parsed
        except Exception:
            # Final fallback: return raw text as summary
            return {"summary": raw, "videos": [], "day_plan": [], "blogs": [], "notes": []}

    except Exception as e:
        print("🔥 ERROR in generate_skill_roadmap_agent:", str(e))
        return {"summary": "⚠️ Skill roadmap generation failed.", "videos": [], "day_plan": [], "blogs": [], "notes": []}
