import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Play, Calendar, FileText, Lightbulb, Clock, Target, Sparkles, Zap } from "lucide-react";

export default function SkillRoadmapPage({ resume, jobId }) {
  const { skill } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const payload = { skill };
        if (resume?.resume_id) payload.resume_id = resume.resume_id;
        if (jobId) payload.job_id = jobId;
        const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/roadmap/skill`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        const data = await resp.json();
        setDetail(data.detail || data);
      } catch (e) {
        setDetail({ summary: `Failed to load roadmap for ${skill}.` });
      } finally { setLoading(false); }
    }
    fetchDetail();
  }, [skill, resume, jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto p-8">
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl shadow-2xl transform rotate-3 animate-spin-slow flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-3xl shadow-2xl transform -rotate-3 animate-bounce opacity-50"></div>
            </div>
            <h2 className="text-4xl font-bold text-white mt-8 mb-4">
              Loading Your Personalized Roadmap
            </h2>
            <div className="flex items-center justify-center space-x-3 text-cyan-300">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Floating 3D Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-60 right-60 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto p-8">
        {/* Header with 3D Back Button */}
        <div className="mb-12">
          <Link 
            to="/" 
            className="group inline-flex items-center space-x-3 text-cyan-300 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-300 flex items-center justify-center group-hover:shadow-cyan-500/50">
              <ArrowLeft className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-semibold">Back to Dashboard</span>
          </Link>
        </div>

        {/* 3D Title Section */}
        <div className="text-center mb-16 perspective-1000">
          <div className="transform rotateX-5 hover:rotateX-0 transition-transform duration-500">
            <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Skill Roadmap
              </span>
            </h1>
            <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Target className="w-8 h-8 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">
                {decodeURIComponent(skill)}
              </h2>
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* 3D Content Cards */}
        {!loading && detail && (
          <div className="space-y-8">
            {/* Summary Card with 3D Effect */}
            {(typeof detail === 'string' || detail.summary) && (
              <div className="group perspective-1000">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:rotateY-2 hover:scale-105 transition-all duration-500 hover:shadow-cyan-500/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl transform rotate-3 group-hover:rotate-0 transition-all duration-300 flex items-center justify-center">
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Overview</h3>
                  </div>
                  <div className="text-gray-100 text-lg leading-relaxed">
                    {typeof detail === 'string' ? (
                      <pre className="whitespace-pre-wrap font-sans">{detail}</pre>
                    ) : (
                      <p>{detail.summary}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Videos Section with 3D Cards */}
            {typeof detail === 'object' && Array.isArray(detail.videos) && detail.videos.length > 0 && (
              <div className="group perspective-1000">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:rotateY-1 hover:scale-105 transition-all duration-500 hover:shadow-red-500/20">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-xl transform rotate-3 group-hover:rotate-0 transition-all duration-300 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Video Resources</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {detail.videos.map((v, i) => (
                      <div key={i} className="group/video perspective-500">
                        <a 
                          href={v.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="block bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-red-400/50 transition-all duration-300 transform hover:rotateX-2 hover:scale-105 hover:shadow-xl"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-white text-lg mb-2 group-hover/video:text-red-300 transition-colors">
                                {v.title}
                              </h4>
                              {v.duration && (
                                <div className="flex items-center space-x-2 text-gray-300">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-sm">{v.duration}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Day Plan with 3D Timeline */}
            {typeof detail === 'object' && Array.isArray(detail.day_plan) && detail.day_plan.length > 0 && (
              <div className="group perspective-1000">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:rotateY-1 hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-xl transform rotate-3 group-hover:rotate-0 transition-all duration-300 flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Learning Timeline</h3>
                  </div>
                  <div className="space-y-6">
                    {detail.day_plan.map((d, idx) => (
                      <div key={idx} className="group/day perspective-500">
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transform hover:rotateX-1 hover:scale-102 transition-all duration-300 hover:shadow-lg hover:border-purple-400/30">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold">{idx + 1}</span>
                            </div>
                            <h4 className="text-xl font-bold text-white">
                              {d.day || `Day ${idx + 1}`}
                            </h4>
                            {d.estimated_minutes && (
                              <div className="flex items-center space-x-2 text-purple-300 bg-purple-500/20 rounded-full px-3 py-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">{d.estimated_minutes} min</span>
                              </div>
                            )}
                          </div>
                          <ul className="space-y-3">
                            {(d.tasks || []).map((t, i) => (
                              <li key={i} className="flex items-start space-x-3 text-gray-100">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-lg">{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Blogs Section with 3D Effects */}
            {typeof detail === 'object' && Array.isArray(detail.blogs) && detail.blogs.length > 0 && (
              <div className="group perspective-1000">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:rotateY-1 hover:scale-105 transition-all duration-500 hover:shadow-blue-500/20">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-xl transform rotate-3 group-hover:rotate-0 transition-all duration-300 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Reading Materials</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {detail.blogs.map((b, i) => (
                      <div key={i} className="group/blog perspective-500">
                        <a 
                          href={b.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="block bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300 transform hover:rotateX-2 hover:scale-105 hover:shadow-xl"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-white text-lg group-hover/blog:text-blue-300 transition-colors">
                                {b.title}
                              </h4>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes Section with 3D Effects */}
            {typeof detail === 'object' && Array.isArray(detail.notes) && detail.notes.length > 0 && (
              <div className="group perspective-1000">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:rotateY-1 hover:scale-105 transition-all duration-500 hover:shadow-yellow-500/20">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl shadow-xl transform rotate-3 group-hover:rotate-0 transition-all duration-300 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Key Notes</h3>
                  </div>
                  <ul className="space-y-4">
                    {detail.notes.map((n, i) => (
                      <li key={i} className="flex items-start space-x-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transform hover:scale-102 transition-all duration-200">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-100 text-lg">{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <style jsx>{`
          .perspective-1000 {
            perspective: 1000px;
          }
          .perspective-500 {
            perspective: 500px;
          }
          .rotateX-5 {
            transform: rotateX(5deg);
          }
          .rotateX-0:hover {
            transform: rotateX(0deg);
          }
          .rotateY-1:hover {
            transform: rotateY(1deg);
          }
          .rotateY-2:hover {
            transform: rotateY(2deg);
          }
          .rotateX-1:hover {
            transform: rotateX(1deg);
          }
          .rotateX-2:hover {
            transform: rotateX(2deg);
          }
          .scale-102:hover {
            transform: scale(1.02);
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animation-delay-6000 {
            animation-delay: 6s;
          }
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          .animate-spin-slow {
            animation: spin 8s linear infinite;
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}