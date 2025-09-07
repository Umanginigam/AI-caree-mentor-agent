import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Roadmap({ resume, jobId }) {
  const [roadmap, setRoadmap] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [detailedRoadmap, setDetailedRoadmap] = useState(null);
  const [loadingSkill, setLoadingSkill] = useState(false);
  
  const hardcodedSkills = [
    {
      category: "Technical Skills",
      skills: [
        { name: "Python Programming", progress: 80, status: "completed" },
        { name: "Machine Learning", progress: 60, status: "in-progress" },
        { name: "Data Structures", progress: 90, status: "completed" },
        { name: "SQL Databases", progress: 70, status: "in-progress" },
      ]
    },
    {
      category: "Soft Skills",
      skills: [
        { name: "Communication", progress: 85, status: "completed" },
        { name: "Problem Solving", progress: 75, status: "in-progress" },
        { name: "Team Collaboration", progress: 90, status: "completed" },
        { name: "Time Management", progress: 65, status: "in-progress" },
      ]
    }
  ];

  useEffect(() => {
    if (resume?.resume_id && jobId) {
      axios.get(`http://localhost:8000/roadmap/ai/${resume.resume_id}/${jobId}`)
        .then(res => setRoadmap(res.data))
        .catch(err => console.error(err));
    }
  }, [resume, jobId]);

  const allSkills = hardcodedSkills.flatMap(c => c.skills.map(s => ({ ...s, category: c.category })));

  const filteredSkills = allSkills.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const navigate = useNavigate();

  const requestDetailedRoadmap = (skillName) => {
    // navigate to dedicated skill roadmap page (encode skill in URL)
    navigate(`/roadmap/skill/${encodeURIComponent(skillName)}`);
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'bg-green-500' : 'bg-yellow-500';
  };

  return (
    <div className="p-6 mt-4 border rounded-lg shadow-2xl bg-white transform hover:scale-[1.02] transition-all duration-300 ease-in-out" style={{ perspective: '1000px' }}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 transform hover:translate-x-2 transition-transform duration-200">Career Development Roadmap</h2>
      
      <div className="space-y-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search skills</label>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search skills (e.g. Python, Machine Learning)"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        {hardcodedSkills.map((category, idx) => (
          <div key={idx} className="space-y-4 transform hover:-translate-y-1 transition-transform duration-200">
            <h3 className="text-xl font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-200">{category.category}</h3>
            <div className="grid gap-4">
              {category.skills.map((skill, skillIdx) => (
                <div 
                  key={skillIdx} 
                  className="bg-gray-50 p-4 rounded-lg transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-200 hover:border-blue-200 cursor-pointer"
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden'
                  }}
                  onClick={() => requestDetailedRoadmap(skill.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') requestDetailedRoadmap(skill.name); }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 transform hover:translate-x-1 transition-transform duration-200">{skill.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(skill.status)} shadow-md transform hover:scale-105 transition-transform duration-200`}>
                      {skill.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                    <div
                      className={`h-2.5 rounded-full ${getStatusColor(skill.status)} transition-all duration-500 ease-out shadow-lg`}
                      style={{ 
                        width: `${skill.progress}%`,
                        transform: 'translateZ(2px)'
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 mt-1 inline-block transform hover:translate-x-1 transition-transform duration-200">
                    {skill.progress}% Complete
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {roadmap && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out border border-blue-200" style={{ transformStyle: 'preserve-3d' }}>
          <h3 className="text-lg font-semibold text-blue-800 mb-2 transform hover:translate-x-1 transition-transform duration-200">AI Recommendations</h3>
          <p className="text-gray-700 hover:text-gray-800 transition-colors duration-200">{roadmap.ai_roadmap}</p>
        </div>
      )}

      {/* Skill-specific detailed roadmap */}
      <div className="mt-6">
        {loadingSkill && (
          <div className="p-4 bg-white rounded-lg shadow-md">Generating detailed roadmap for <strong>{selectedSkill}</strong>…</div>
        )}

        {!loadingSkill && detailedRoadmap && (
          <div className="mt-4 p-4 bg-gradient-to-r from-white to-blue-50 rounded-lg shadow-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Detailed Roadmap for {selectedSkill}</h3>
            <div className="prose max-w-none text-gray-700">
              {typeof detailedRoadmap === 'string' && (
                <pre className="whitespace-pre-wrap">{detailedRoadmap}</pre>
              )}

              {typeof detailedRoadmap === 'object' && (
                <div className="space-y-4">
                  {detailedRoadmap.summary && (
                    <div>
                      <h4 className="font-semibold">Summary</h4>
                      <p>{detailedRoadmap.summary}</p>
                    </div>
                  )}

                  {Array.isArray(detailedRoadmap.videos) && detailedRoadmap.videos.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Videos</h4>
                      <ul className="list-disc pl-5">
                        {detailedRoadmap.videos.map((v, i) => (
                          <li key={i}>
                            <a className="text-blue-600 hover:underline" href={v.url} target="_blank" rel="noreferrer">{v.title}</a>
                            {v.duration && <span className="text-sm text-gray-500"> — {v.duration}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(detailedRoadmap.day_plan) && detailedRoadmap.day_plan.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Day Plan</h4>
                      <div className="space-y-2">
                        {detailedRoadmap.day_plan.map((d, idx) => (
                          <div key={idx} className="p-2 bg-white rounded border">
                            <div className="font-medium">{d.day || `Day ${idx+1}`}</div>
                            <div className="text-sm text-gray-700">
                              <ul className="list-disc pl-5">
                                {(d.tasks || []).map((t, ti) => <li key={ti}>{t}</li>)}
                              </ul>
                              {d.estimated_minutes && <div className="text-xs text-gray-500 mt-1">Estimated: {d.estimated_minutes} minutes</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(detailedRoadmap.blogs) && detailedRoadmap.blogs.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Blogs / Articles</h4>
                      <ul className="list-disc pl-5">
                        {detailedRoadmap.blogs.map((b, i) => (
                          <li key={i}><a className="text-blue-600 hover:underline" href={b.url} target="_blank" rel="noreferrer">{b.title}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(detailedRoadmap.notes) && detailedRoadmap.notes.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Notes</h4>
                      <ul className="list-disc pl-5 text-gray-700">
                        {detailedRoadmap.notes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
