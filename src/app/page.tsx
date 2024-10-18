// app/page.tsx
"use client";

import { useEffect, useState } from 'react';

interface ResumeInfo {
  Name: string;
  Email: string;
  GitHub: string;
  LinkedIn: string;
  Education: string[];
  "Professional Experience": Array<{
    Role: string;
    Duration: string;
    Description: string;
  }>;
  Projects: Array<{
    Name: string;
    Description: string;
    Technologies: string[];
  }>;
  Skills: string[];
  "Questions and Answers": Array<{
    Question: string;
    Answer: string;
  }>;
}

export default function ResumePage() {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const username = process.env.NEXT_PUBLIC_RESUME_USERNAME;
        if (!username) {
          throw new Error('Username not configured');
        }

        const response = await fetch(`https://portlinkpy.vercel.app/api/resume/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resume data');
        }

        const data = await response.json();
        setResumeInfo(data.extracted_info.resumeInfo);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!resumeInfo) {
    return <div className="flex justify-center items-center min-h-screen">No resume data found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{resumeInfo.Name}</h1>
          <div className="space-x-4">
            <a href={`mailto:${resumeInfo.Email}`} className="text-blue-600 hover:underline">{resumeInfo.Email}</a>
            {resumeInfo.GitHub && (
              <a href={resumeInfo.GitHub} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
            )}
            {resumeInfo.LinkedIn && (
              <a href={resumeInfo.LinkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
            )}
          </div>
        </div>

        {/* Education Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Education</h2>
          <ul className="list-disc pl-5 space-y-2">
            {resumeInfo.Education.map((edu, index) => (
              <li key={index} className="text-gray-700">{edu}</li>
            ))}
          </ul>
        </section>

        {/* Professional Experience Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Professional Experience</h2>
          <div className="space-y-6">
            {resumeInfo["Professional Experience"].map((exp, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold">{exp.Role}</h3>
                <p className="text-gray-600 mb-2">{exp.Duration}</p>
                <p className="text-gray-700">{exp.Description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Projects</h2>
          <div className="space-y-6">
            {resumeInfo.Projects.map((project, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold">{project.Name}</h3>
                <p className="text-gray-700 mb-2">{project.Description}</p>
                <p className="text-gray-600">
                  <span className="font-medium">Technologies:</span> {project.Technologies.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeInfo.Skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Q&A Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Questions & Answers</h2>
          <div className="space-y-6">
            {resumeInfo["Questions and Answers"].map((qa, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-2">Q: {qa.Question}</h3>
                <p className="text-gray-700">A: {qa.Answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}