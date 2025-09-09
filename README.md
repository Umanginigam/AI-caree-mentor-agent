# 🧑‍💼 Career Mentor – AI-powered Career Guidance System

Career Mentor is an **AI-driven web application** designed to help students and professionals with **career planning, skill analysis, job matching, and personalized roadmaps**. It leverages modern AI models, job APIs, and resume parsing to deliver tailored recommendations.

---

## 🚀 Features

- **Resume Upload & Parsing**  
  Extracts skills, experience, and education from resumes.

- **Semantic Job Matching**  
  Matches resumes with job postings using **BERT embeddings** for better accuracy than keyword-based systems.

- **Skill Gap Analysis**  
  Identifies missing skills and recommends personalized learning paths.

- **AI-Powered Roadmap Generator**  
  Creates step-by-step roadmaps for chosen skills and career goals.

- **News Feed**  
  Shows the latest industry updates, internships, and AI/tech news.

- **Skill Tests**  
  Users can attempt skill-based tests to measure knowledge and track progress.

- **Multi-language Support**  
  English + one additional language (extendable).

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** (Python)
- **MongoDB Atlas** (Database)
- **BERT / Hugging Face Models**
- **SerpAPI / RapidAPI** (Job & News APIs)

### Frontend
- **React (Vite + Tailwind CSS)**
- **Lucide Icons**
- **Axios / Fetch API** for backend communication

### Deployment
- **Render** (Backend + Frontend hosting)
- **MongoDB Atlas** (Database in cloud)

---

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB Atlas account
- SerpAPI / RapidAPI key

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```
# Create .env file
echo "MONGO_URI=your_mongo_uri" >> .env
echo "SERPAPI_KEY=your_serpapi_key" >> .env
echo "RAPIDAPI_KEY=your_rapidapi_key" >> .env
```
uvicorn app.main:app --reload
```
# Frontend
```bash
cd frontend
npm install
npm run dev
```
🌍 Deployment
Backend → Deploy on Render with environment variables set.
Frontend → Deploy React app on Render/Netlify/Vercel.
Database → Use MongoDB Atlas (don’t forget to whitelist Render IPs).

📊 Experimental Results
Top-1 Job Matching Accuracy: 68.2% (vs 48.6% baseline keyword match)
Skill Gap Analysis: Enabled actionable recommendations for missing skills.
User Feedback: Roadmaps rated helpful in 78% of test cases.

🤝 Contributing
Pull requests are welcome! Please open an issue first for feature discussions.
