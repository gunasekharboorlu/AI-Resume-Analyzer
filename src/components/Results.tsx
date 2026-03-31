import { CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultsProps {
  result: AnalysisResult;
}

export default function Results({ result }: ResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-blue-50 border-blue-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className={`p-8 rounded-2xl border-2 ${getScoreBgColor(result.matchScore)} transition-all duration-300`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Match Score</h2>
          <div className={`text-7xl font-bold ${getScoreColor(result.matchScore)} mb-2`}>
            {result.matchScore}%
          </div>
          <p className="text-gray-600">
            {result.matchScore >= 80 && "Excellent Match!"}
            {result.matchScore >= 60 && result.matchScore < 80 && "Good Match"}
            {result.matchScore >= 40 && result.matchScore < 60 && "Moderate Match"}
            {result.matchScore < 40 && "Needs Improvement"}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-600" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Matched Skills</h3>
          </div>
          {result.matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No matching skills found</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="text-red-600" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Missing Skills</h3>
          </div>
          {result.missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">All required skills found!</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Your Resume Skills</h3>
        </div>
        {result.resumeSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {result.resumeSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills detected in resume</p>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Suggestions</h3>
        </div>
        <ul className="space-y-2">
          {result.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-1">•</span>
              <span className="text-gray-700">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
