import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { PDFExtract } from "npm:pdf.js-extract@0.2.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  resumeSkills: string[];
  jobSkills: string[];
  suggestions: string[];
}

function extractSkills(text: string): string[] {
  const skillKeywords = [
    "python", "javascript", "typescript", "react", "angular", "vue", "node.js", "nodejs",
    "java", "c++", "c#", "ruby", "php", "swift", "kotlin", "go", "rust",
    "html", "css", "sass", "scss", "tailwind", "bootstrap",
    "sql", "mongodb", "postgresql", "mysql", "redis", "elasticsearch",
    "docker", "kubernetes", "aws", "azure", "gcp", "cloud",
    "git", "github", "gitlab", "ci/cd", "jenkins", "devops",
    "machine learning", "ml", "ai", "artificial intelligence", "data science",
    "tensorflow", "pytorch", "keras", "pandas", "numpy",
    "rest api", "restful", "graphql", "api", "microservices",
    "agile", "scrum", "jira", "project management",
    "flask", "django", "express", "fastapi", "spring boot",
    "testing", "unit testing", "jest", "pytest", "selenium",
    "linux", "unix", "bash", "shell scripting",
    "problem solving", "communication", "teamwork", "leadership"
  ];

  const normalizedText = text.toLowerCase();
  const foundSkills = new Set<string>();

  skillKeywords.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      foundSkills.add(skill.toLowerCase());
    }
  });

  return Array.from(foundSkills);
}

function calculateMatchScore(resumeSkills: string[], jobSkills: string[]): number {
  if (jobSkills.length === 0) return 0;

  const matchedCount = jobSkills.filter(skill =>
    resumeSkills.includes(skill.toLowerCase())
  ).length;

  return Math.round((matchedCount / jobSkills.length) * 100);
}

function findMissingSkills(resumeSkills: string[], jobSkills: string[]): string[] {
  return jobSkills.filter(skill =>
    !resumeSkills.includes(skill.toLowerCase())
  );
}

function generateSuggestions(missingSkills: string[], matchScore: number): string[] {
  const suggestions: string[] = [];

  if (matchScore >= 80) {
    suggestions.push("Excellent match! Your resume aligns well with the job requirements.");
  } else if (matchScore >= 60) {
    suggestions.push("Good match! Consider adding more relevant experience for missing skills.");
  } else if (matchScore >= 40) {
    suggestions.push("Moderate match. Focus on developing the missing skills listed below.");
  } else {
    suggestions.push("Low match. Consider gaining experience in the required skills before applying.");
  }

  if (missingSkills.length > 0) {
    suggestions.push(`Add the following ${missingSkills.length} missing skill(s) to your resume if you have them: ${missingSkills.slice(0, 5).join(", ")}${missingSkills.length > 5 ? "..." : ""}`);
  }

  suggestions.push("Use action verbs and quantify your achievements with metrics.");
  suggestions.push("Tailor your resume to match the job description keywords.");

  return suggestions;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const pdfFile = formData.get("resume") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!pdfFile || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Missing resume file or job description" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const pdfExtract = new PDFExtract();
    const data = await pdfExtract.extractBuffer(buffer);

    let resumeText = "";
    data.pages.forEach((page: { content: { str: string }[] }) => {
      page.content.forEach(item => {
        resumeText += item.str + " ";
      });
    });

    const resumeSkills = extractSkills(resumeText);
    const jobSkills = extractSkills(jobDescription);

    const matchedSkills = jobSkills.filter(skill =>
      resumeSkills.includes(skill.toLowerCase())
    );

    const missingSkills = findMissingSkills(resumeSkills, jobSkills);
    const matchScore = calculateMatchScore(resumeSkills, jobSkills);
    const suggestions = generateSuggestions(missingSkills, matchScore);

    const result: AnalysisResult = {
      matchScore,
      matchedSkills,
      missingSkills,
      resumeSkills,
      jobSkills,
      suggestions
    };

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error analyzing resume:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to analyze resume",
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
