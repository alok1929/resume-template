'use client'

import { useEffect, useState } from 'react'
import { Mail, GitHub, Linkedin, Book, Briefcase, Code, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ResumeInfo {
  Name: string
  Email: string
  GitHub: string
  LinkedIn: string
  Education: string[]
  "Professional Experience": Array<{
    Role: string
    Duration: string
    Description: string
  }>
  Projects: Array<{
    Name: string
    Description: string
    Technologies: string[]
  }>
  Skills: string[]
  "Questions and Answers": Array<{
    Question: string
    Answer: string
  }>
}

export default function PortfolioResume() {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const username = process.env.NEXT_PUBLIC_RESUME_USERNAME
        if (!username) {
          throw new Error('Username not configured')
        }

        const response = await fetch(`https://portlinkpy.vercel.app/api/resume/${username}`)
        if (!response.ok) {
          throw new Error('Failed to fetch resume data')
        }

        const data = await response.json()
        setResumeInfo(data.extracted_info.resumeInfo)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resume')
      } finally {
        setLoading(false)
      }
    }

    fetchResumeData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  }

  if (!resumeInfo) {
    return <div className="flex justify-center items-center min-h-screen">No resume data found</div>
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:space-x-8">
          {/* Sidebar */}
          <aside className="lg:w-1/3 mb-8 lg:mb-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">{resumeInfo.Name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${resumeInfo.Email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      {resumeInfo.Email}
                    </a>
                  </Button>
                  {resumeInfo.GitHub && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={resumeInfo.GitHub} target="_blank" rel="noopener noreferrer">
                        <GitHub className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {resumeInfo.LinkedIn && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={resumeInfo.LinkedIn} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeInfo.Skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Book className="w-5 h-5 mr-2" />
                    Education
                  </h2>
                  <ul className="space-y-2">
                    {resumeInfo.Education.map((edu, index) => (
                      <li key={index} className="text-muted-foreground">{edu}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:w-2/3 space-y-8">
            {/* Professional Experience Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Briefcase className="w-6 h-6 mr-2" />
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeInfo["Professional Experience"].map((exp, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold">{exp.Role}</h3>
                    <p className="text-muted-foreground mb-2">{exp.Duration}</p>
                    <p>{exp.Description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Code className="w-6 h-6 mr-2" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeInfo.Projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold">{project.Name}</h3>
                    <p className="mb-2">{project.Description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.Technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Q&A Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Questions & Answers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeInfo["Questions and Answers"].map((qa, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold mb-2">Q: {qa.Question}</h3>
                    <p>A: {qa.Answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}