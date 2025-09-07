import { useState } from "react";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

export default function ResumeUpload({ setResume }) {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ✅ Backend URL from environment variable
 

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`https://career-mentor-app.onrender.com/resume/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed with status " + res.status);
      }

      const data = await res.json();
      setResume(data); // store resume_id and skills
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Resume upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.name.endsWith('.pdf'))) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent)] animate-pulse"></div>

      <div className="relative p-8 border-2 border-dashed border-gray-200 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-indigo-300 hover:scale-[1.01]">

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-full mb-4 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <Upload className="w-10 h-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-3">
            Upload Your Resume
          </h2>
          <p className="text-gray-600 text-base">
            Drop your PDF file here or click to browse • Get instant skill analysis
          </p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
            isDragOver
              ? "border-indigo-400 bg-indigo-50 scale-105 shadow-lg"
              : file
              ? "border-green-400 bg-green-50 shadow-md"
              : "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-green-700 font-bold text-lg">{file.name}</p>
                  <p className="text-green-600 text-sm">Ready to upload</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600 animate-bounce" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Upload className="w-16 h-16 text-gray-400 mx-auto animate-bounce" />
                <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div>
                <p className="text-gray-700 font-semibold text-lg mb-2">
                  Drag & drop your resume here
                </p>
                <p className="text-gray-500 text-sm">
                  Supports PDF files up to 10MB
                </p>
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`w-full mt-8 py-5 px-6 rounded-xl font-bold text-white text-xl transition-all duration-300 shadow-xl relative overflow-hidden ${
            !file || isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : uploadSuccess
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              : "bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 hover:shadow-2xl transform hover:scale-105 active:scale-95"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          {isUploading ? (
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing Resume...</span>
            </div>
          ) : uploadSuccess ? (
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
              <span>Upload Successful!</span>
            </div>
          ) : (
            <span className="relative z-10">Upload & Analyze Resume</span>
          )}
        </button>

        {uploadSuccess && (
          <div className="absolute inset-0 bg-green-500/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-full p-6 shadow-2xl animate-bounce">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
