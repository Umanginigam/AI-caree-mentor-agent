import { useEffect, useState } from "react";
import { Newspaper, ExternalLink, Clock, Building2, Sparkles } from "lucide-react";

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/news?query=ai+internship&limit=5")
      .then(res => res.json())
      .then(data => {
        // The backend now returns an array directly
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 opacity-70"></div>
        <div className="relative p-8 border-2 border-emerald-200 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <Newspaper className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Latest Career News
            </h2>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mt-4 border rounded-lg shadow-md bg-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 opacity-70"></div>
        <div className="relative p-8 border-2 border-emerald-200 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-emerald-300">
          
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <Newspaper className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Latest Career News
            </h2>
            <Sparkles className="w-5 h-5 text-emerald-500 animate-bounce" />
          </div>

          {Array.isArray(news) && news.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {news.map((item, i) => (
                <div key={i} className="group p-4 bg-white/60 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                  <a 
                    href={item.newsUrl || item.url} 
                    className="block" 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-emerald-800 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2 flex-1 mr-3">
                        {item.title}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 mt-1" />
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-emerald-600 mb-3">
                      {item.publisher || item.source ? (
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-3 h-3" />
                          <span className="font-medium">{item.publisher || item.source}</span>
                        </div>
                      ) : null}
                      {item.timestamp ? (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(Number(item.timestamp)).toLocaleDateString()}</span>
                        </div>
                      ) : null}
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {item.snippet || item.description}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No news found at the moment</p>
              <p className="text-gray-400 text-sm">Check back later for updates</p>
            </div>
          )}
        </div>
        
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #10b981;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #059669;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  );
}