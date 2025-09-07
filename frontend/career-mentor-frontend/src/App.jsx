import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResumeUpload from "./components/ResumeUpload";
import JobMatches from "./components/JobMatches";
import Roadmap from "./components/Roadmap";
import NewsFeed from "./components/NewsFeed";
import SkillRoadmapPage from "./pages/SkillRoadmapPage";

function App() {
  const [resume, setResume] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">AI Career Mentor</h1>
            <ResumeUpload setResume={setResume} />
            <JobMatches resume={resume} />
            <Roadmap resume={resume} jobId={selectedJobId} />
            <NewsFeed />
          </div>
        } />

        <Route path="/roadmap/skill/:skill" element={<SkillRoadmapPage resume={resume} jobId={selectedJobId} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
