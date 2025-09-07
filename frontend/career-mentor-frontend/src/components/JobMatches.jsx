import { useEffect, useState } from "react";
import { Briefcase, Target, AlertTriangle, CheckCircle2, TrendingUp, Users, MapPin, Clock, Zap, Star } from "lucide-react";

export default function JobMatches({ resume }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);

  useEffect(() => {
    // Fetch jobs from the new /jobs/list endpoint
    fetch("http://localhost:8000/jobs/list")
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSelectJob = (jobId) => {
    setSelectedJob(jobId);
    setMatchLoading(true);
    fetch(`http://localhost:8000/match/${resume.resume_id}/${jobId}`)
      .then(res => res.json())
      .then(data => {
        setMatchResult(data);
        setMatchLoading(false);
      })
      .catch(err => {
        setMatchResult(null);
        setMatchLoading(false);
      });
  };

  const getMatchColor = (percent) => {
    if (percent >= 80) return "from-green-500 to-emerald-600";
    if (percent >= 60) return "from-blue-500 to-cyan-600";
    if (percent >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-600";
  };

  const getMatchBgColor = (percent) => {
    if (percent >= 80) return "bg-green-50 border-green-200";
    if (percent >= 60) return "bg-blue-50 border-blue-200";
    if (percent >= 40) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  if (!resume) return null;

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 opacity-70"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-violet-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
              Job Matches
            </h2>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 opacity-70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent)] animate-pulse"></div>
      
      {/* Main container */}
      <section className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-violet-200 p-8 transition-all duration-300 hover:shadow-3xl hover:border-violet-300">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-violet-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              <Briefcase className="w-8 h-8 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-800 via-purple-800 to-pink-800 bg-clip-text text-transparent">
                Job Matches
              </h2>
              <p className="text-violet-600 font-medium">
                Find your perfect career opportunity
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-violet-100 rounded-full px-4 py-2">
            <Target className="w-5 h-5 text-violet-600" />
            <span className="text-violet-700 font-semibold text-sm">
              {jobs.length} Jobs Available
            </span>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">No Jobs Available</h3>
            <p className="text-gray-500">Check back later for new opportunities</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => handleSelectJob(job._id)}
                className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  selectedJob === job._id 
                    ? "bg-gradient-to-r from-violet-100 to-purple-100 border-2 border-violet-300 shadow-lg" 
                    : "bg-white/70 border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50/70"
                }`}
              >
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-violet-700 transition-colors duration-200">
                        {job.title}
                      </h3>
                    </div>
                    
                    {/* Job Meta Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      {job.company && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                      )}
                      {job.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.type && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedJob === job._id && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-violet-500 animate-pulse" />
                      <span className="text-violet-600 font-semibold text-sm">Selected</span>
                    </div>
                  )}
                </div>

                {/* Job Description Preview */}
                {job.description && (
                  <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                    {job.description}
                  </p>
                )}

                {/* Match Results */}
                {selectedJob === job._id && (
                  <div className="mt-6 pt-6 border-t-2 border-violet-200">
                    {matchLoading ? (
                      <div className="flex items-center justify-center space-x-3 py-4">
                        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-violet-600 font-medium">Analyzing match...</span>
                      </div>
                    ) : matchResult ? (
                      <div className="space-y-4">
                        {/* Match Percentage */}
                        <div className={`p-4 rounded-xl border-2 ${getMatchBgColor(matchResult.match_percent)}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-5 h-5 text-gray-700" />
                              <span className="font-bold text-gray-800">Match Score</span>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-white font-bold text-lg bg-gradient-to-r ${getMatchColor(matchResult.match_percent)}`}>
                              {matchResult.match_percent}%
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${getMatchColor(matchResult.match_percent)} transition-all duration-1000 ease-out rounded-full`}
                              style={{ width: `${matchResult.match_percent}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Skill Gap */}
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              {matchResult.skill_gap && matchResult.skill_gap.length > 0 ? (
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 mb-2 flex items-center space-x-2">
                                <span>Skills to Develop</span>
                                {matchResult.skill_gap && matchResult.skill_gap.length === 0 && (
                                  <Zap className="w-4 h-4 text-green-500" />
                                )}
                              </h4>
                              {matchResult.skill_gap && matchResult.skill_gap.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {matchResult.skill_gap.map((skill, index) => (
                                    <span 
                                      key={index}
                                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium border border-red-200"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-green-700 font-medium">
                                  Perfect match! You have all required skills. 🎉
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-red-600 font-medium">Failed to analyze match</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Click indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                    <Target className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #8b5cf6;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #7c3aed;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .shadow-3xl {
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
          }
        `}</style>
      </section>
    </div>
  );
}