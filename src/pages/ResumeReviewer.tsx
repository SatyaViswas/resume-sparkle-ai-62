import AppHeader from "@/components/AppHeader";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Compass,
  Wrench,
  TrendingUp,
  MapPin,
  Building,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

const ResumeReviewer = () => {
  const [uploadStep, setUploadStep] = useState<"upload" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [jobsData, setJobsData] = useState<any[]>([]);
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [careerAnalysisStatus, setCareerAnalysisStatus] = useState<"analyzing" | "complete" | "error">("complete");
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadStep("processing");
    setProgress(20);

    try {
      // Get current user (optional for guest uploads)
      const { data: { user } } = await supabase.auth.getUser();

      setProgress(40);

      // Call the analyze-resume edge function
      const formData = new FormData();
      formData.append('file', file);
      if (user) {
        formData.append('userId', user.id);
      }

      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: formData,
      });

      if (error) throw error;

      setProgress(80);

      if (data.success) {
        setAnalysisData(data.analysis);
        setJobsData(data.jobs || []);
        setExtractedText(data.extracted_text || '');
        setExtractedSkills(data.analysis?.keywords || []);
        setCareerAnalysisStatus("complete");
        setProgress(100);
        setUploadStep("complete");
        
        toast({
          title: "Analysis complete!",
          description: "Your resume has been analyzed successfully.",
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not analyze resume. Please try again.",
        variant: "destructive",
      });
      setUploadStep("upload");
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  const handleGenerateQuestions = async () => {
    setIsGeneratingQuestions(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('generate-interview-questions', {
        body: {
          userId: user?.id || null,
          resumeText: extractedText,
          targetRole: 'Software Developer'
        }
      });

      if (error) throw error;

      if (data.success) {
        setQuestionsData(data.questions || []);
        toast({
          title: "Questions generated!",
          description: "Interview questions have been generated based on your resume.",
        });
      } else {
        throw new Error(data.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Question generation error:', error);
      toast({
        title: "Generation failed",
        description: "Could not generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Use real data or fallback to mock data
  const currentAnalysis = analysisData || {
    strengths: [
      "Strong technical skills section with relevant technologies",
      "Clear project descriptions with quantifiable results",
      "Professional summary is concise and targeted",
      "Education section properly formatted"
    ],
    weaknesses: [
      "Missing keywords for target role",
      "Work experience lacks impact metrics",
      "No mention of soft skills or leadership",
      "Contact information could be more complete"
    ],
    ats_score: 84,
    improvements: [
      "Add more industry-specific keywords (React, TypeScript, Node.js)",
      "Include quantifiable achievements (increased performance by 40%)",
      "Add a skills section with both technical and soft skills",
      "Consider adding relevant certifications or training"
    ]
  };

  const careerPaths = analysisData?.career_paths || [];

  const reAnalyzeCareerPaths = async () => {
    if (!extractedText) return;
    
    setCareerAnalysisStatus("analyzing");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const formData = new FormData();
      formData.append('resumeText', extractedText);
      if (user) {
        formData.append('userId', user.id);
      }
      
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: formData
      });

      if (error) throw error;

      if (data.success && data.analysis?.career_paths) {
        setAnalysisData(prev => ({ ...prev, career_paths: data.analysis.career_paths }));
        setCareerAnalysisStatus("complete");
        toast({
          title: "Career paths updated!",
          description: "Fresh career suggestions have been generated.",
        });
      } else {
        throw new Error('Failed to re-analyze career paths');
      }
    } catch (error) {
      console.error('Career re-analysis error:', error);
      setCareerAnalysisStatus("error");
      toast({
        title: "Re-analysis failed",
        description: "Could not generate fresh career paths. Please try again.",
        variant: "destructive",
      });
    }
  };

  const mockJobs = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      description: "Build responsive web applications with React and TypeScript..."
    },
    {
      title: "React Developer",
      company: "StartupXYZ",
      location: "New York, NY",
      description: "Join our growing team to develop cutting-edge web applications..."
    },
    {
      title: "Full Stack Engineer",
      company: "Innovation Labs",
      location: "Austin, TX",
      description: "Work on both frontend and backend systems using modern technologies..."
    }
  ];

  const mockQuestions = [
    {
      type: "Behavioral",
      question: "Tell me about a time when you had to work with a difficult team member.",
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      type: "Technical",
      question: "How would you optimize the performance of a React application?",
      icon: <Wrench className="w-5 h-5" />
    },
    {
      type: "Situational",
      question: "How would you handle a situation where a project deadline is at risk?",
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      type: "Behavioral",
      question: "Describe a project you're most proud of and why.",
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      type: "Technical",
      question: "Explain the difference between server-side and client-side rendering.",
      icon: <Wrench className="w-5 h-5" />
    },
    {
      type: "Situational",
      question: "How would you approach learning a new technology for a project?",
      icon: <AlertTriangle className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Resume Reviewer</h1>
          <p className="text-muted-foreground">Upload your resume for AI-powered analysis and feedback</p>
        </div>

        {uploadStep === "upload" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card className="p-8 text-center card-shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Upload Your Resume</h2>
              <p className="text-muted-foreground mb-8">
                Drag & drop your PDF/DOC file or upload a JPG/PNG photo of your resume
              </p>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-12 mb-6 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={handleUpload}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileUpload(file);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Drag your resume here or click to browse</p>
                </div>
              <Button 
                onClick={handleUpload}
                className="gradient-primary text-white px-8 py-6 text-lg"
              >
                Upload Resume
              </Button>
            </Card>
          </div>
        )}

        {uploadStep === "processing" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card className="p-8 text-center card-shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Analyzing Your Resume</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading file...</span>
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Extracting text...</span>
                  {progress >= 40 ? <CheckCircle className="w-4 h-4 text-success" /> : <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Analyzing resume...</span>
                  {progress >= 80 ? <CheckCircle className="w-4 h-4 text-success" /> : <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fetching jobs...</span>
                  {progress >= 100 ? <CheckCircle className="w-4 h-4 text-success" /> : <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                </div>
              </div>
              <Progress value={progress} className="mb-4" />
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </Card>
          </div>
        )}

        {uploadStep === "complete" && (
          <div className="animate-fade-in">
            <Tabs defaultValue="analysis" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="careers">Career Paths</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="interview">Interview Prep</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6 card-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-success" />
                      <h3 className="text-lg font-semibold">Strengths ✅</h3>
                    </div>
                    <ul className="space-y-2">
                      {currentAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <span className="w-1 h-1 bg-success rounded-full mt-2 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-6 card-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-warning" />
                      <h3 className="text-lg font-semibold">Weaknesses ⚠️</h3>
                    </div>
                    <ul className="space-y-2">
                      {currentAnalysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <span className="w-1 h-1 bg-warning rounded-full mt-2 flex-shrink-0" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-6 card-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <Compass className="w-6 h-6 text-secondary" />
                      <h3 className="text-lg font-semibold">ATS Score 🧭</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground mb-2">{currentAnalysis.ats_score}%</div>
                      <p className="text-sm text-muted-foreground">Your resume is ATS-friendly</p>
                    </div>
                  </Card>

                  <Card className="p-6 card-shadow">
                    <div className="flex items-center space-x-3 mb-4">
                      <Wrench className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-semibold">Improvements 🔧</h3>
                    </div>
                    <ul className="space-y-2">
                      {currentAnalysis.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="careers" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Career Path Suggestions</h2>
                    <p className="text-muted-foreground">Based on your resume analysis</p>
                  </div>
                  {careerPaths.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={reAnalyzeCareerPaths}
                      disabled={careerAnalysisStatus === "analyzing"}
                    >
                      {careerAnalysisStatus === "analyzing" ? "Re-analyzing..." : "Re-analyze Career Paths"}
                    </Button>
                  )}
                </div>

                {careerAnalysisStatus === "analyzing" && (
                  <Card className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Analyzing your background and suggesting career paths...</p>
                  </Card>
                )}

                {careerAnalysisStatus === "error" && (
                  <Card className="p-8 text-center">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-warning" />
                    <p className="text-muted-foreground">Unable to analyze career paths. Please try uploading resume again.</p>
                  </Card>
                )}

                {careerPaths.length === 0 && careerAnalysisStatus === "complete" && (
                  <Card className="p-8 text-center">
                    <Compass className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Upload a resume to see personalized career suggestions</p>
                  </Card>
                )}

                {careerPaths.length > 0 && careerAnalysisStatus === "complete" && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {careerPaths.map((path: any, index: number) => (
                      <Card key={index} className="p-6 card-shadow hover:card-shadow-lg transition-all duration-300">
                        <h3 className="text-xl font-bold text-foreground mb-4">{path.title}</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">Why this fits you:</p>
                            <p className="text-sm text-muted-foreground">{path.why_fit || path.whyfit}</p>
                          </div>

                          {path.existing_skills && path.existing_skills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">✅ Skills you have:</p>
                              <div className="flex flex-wrap gap-1">
                                {path.existing_skills.map((skill: string, idx: number) => (
                                  <span key={idx} className="inline-block px-2 py-1 text-xs bg-success/20 text-success rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {path.missing_skills && path.missing_skills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">🎯 Skills to develop:</p>
                              <div className="flex flex-wrap gap-1">
                                {path.missing_skills.map((skill: string, idx: number) => (
                                  <span key={idx} className="inline-block px-2 py-1 text-xs bg-warning/20 text-warning rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {path.learning_resources && path.learning_resources.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">📚 Recommended Learning:</p>
                              <div className="space-y-2">
                                {path.learning_resources.map((resource: any, idx: number) => (
                                  <div key={idx} className="text-xs">
                                    <a 
                                      href={resource.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline font-medium"
                                    >
                                      {resource.course_name}
                                    </a>
                                    <p className="text-muted-foreground">({resource.provider}) - {resource.skill}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {path.learningpath && (
                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">📚 Learning Resource:</p>
                              <a 
                                href={path.learningpath} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                View Learning Path <ExternalLink className="w-3 h-3 inline ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="jobs" className="space-y-6">
                <div className="space-y-4">
                  {(jobsData.length > 0 ? jobsData : [
                    {
                      title: "Frontend Developer",
                      company: "TechCorp Inc.",
                      location: "San Francisco, CA",
                      description: "Build responsive web applications with React and TypeScript...",
                      apply_link: "#"
                    },
                    {
                      title: "Full Stack Engineer", 
                      company: "Innovation Labs",
                      location: "Remote",
                      description: "Work on both frontend and backend systems using modern technologies...",
                      apply_link: "#"
                    }
                  ]).map((job, index) => (
                    <Card key={index} className="p-6 card-shadow hover:card-shadow-lg transition-all duration-300">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground mb-2">{job.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center space-x-1">
                                  <Building className="w-4 h-4" />
                                  <span>{job.company}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{job.location}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{job.description}</p>
                            </div>
                            <Button 
                              className="gradient-primary text-white ml-4"
                              onClick={() => window.open(job.apply_link, '_blank')}
                            >
                              Apply
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="interview" className="space-y-6">
                {questionsData.length === 0 ? (
                  <Card className="p-8 text-center card-shadow">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <MessageSquare className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No questions yet</h3>
                    <p className="text-muted-foreground mb-6">Click Generate to see interview questions based on your resume</p>
                    <Button 
                      onClick={handleGenerateQuestions}
                      disabled={isGeneratingQuestions || !extractedText}
                      className="gradient-primary text-white px-6 py-2"
                    >
                      {isGeneratingQuestions ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        'Generate Interview Questions'
                      )}
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Interview Questions</h3>
                      <Button 
                        onClick={handleGenerateQuestions}
                        disabled={isGeneratingQuestions}
                        variant="outline"
                        size="sm"
                      >
                        {isGeneratingQuestions ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                            Regenerating...
                          </>
                        ) : (
                          'Regenerate'
                        )}
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {questionsData.map((question, index) => (
                        <Card key={index} className="p-6 card-shadow">
                          <div className="flex items-start space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                Question {index + 1}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-foreground font-medium mb-4">{typeof question === 'string' ? question : question.question}</p>
                          <div className="space-y-2">
                            <textarea
                              placeholder="Type your answer here..."
                              className="w-full h-20 p-3 border border-border rounded-lg resize-none text-sm"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeReviewer;