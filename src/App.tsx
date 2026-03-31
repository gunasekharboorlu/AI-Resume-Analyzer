import { useState } from 'react';
import { FileText, Upload, Loader2, Sparkles } from 'lucide-react';
import Results from './components/Results';
import { AnalysisResult } from './types';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setError('Please upload a resume and enter a job description');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-resume`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-blue-600" size={40} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Resume Analyzer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Upload your resume and compare it with any job description
          </p>
        </div>

        {!result ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Upload Resume (PDF)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex items-center justify-center gap-3 w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      {file ? (
                        <>
                          <FileText className="text-blue-600" size={24} />
                          <span className="text-gray-700 font-medium">{file.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="text-gray-400" size={24} />
                          <span className="text-gray-500">Click to upload PDF resume</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={loading || !file || !jobDescription.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Analyze Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Results result={result} />
            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 border-2 border-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
