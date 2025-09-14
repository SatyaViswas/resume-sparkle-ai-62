import AppHeader from "@/components/AppHeader";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { FileText, Download, Eye, MapPin, Phone, Mail, Globe, Github, Linkedin, Award, BookOpen } from "lucide-react";
import { FresherTemplate } from "@/components/resume-templates/FresherTemplate";
import { ProfessionalTemplate } from "@/components/resume-templates/ProfessionalTemplate";
import { CareerSwitcherTemplate } from "@/components/resume-templates/CareerSwitcherTemplate";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

const ResumeBuilder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"details" | "template" | "preview">("details");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    location: "",
    education: "",
    experience: "",
    skills: "",
    projects: "",
    summary: "",
    certifications: "",
    languages: "",
    achievements: "",
    coursework: "",
  });

  const templates = [
    {
      id: "fresher",
      name: "Fresher Resume",
      description: "Perfect for students and recent graduates",
      preview: "Education-focused with projects and coursework emphasis",
      targetLength: "1 page",
      bestFor: "Entry-level positions, internships, first jobs"
    },
    {
      id: "professional",
      name: "Professional Resume",
      description: "Ideal for mid-level working professionals",
      preview: "Experience-driven with quantified achievements",
      targetLength: "1-2 pages",
      bestFor: "Senior roles, career advancement, leadership positions"
    },
    {
      id: "career-switcher",
      name: "Career Switcher Resume",
      description: "For professionals transitioning to new fields",
      preview: "Skills-focused highlighting transferable abilities",
      targetLength: "1 page",
      bestFor: "Industry transitions, career pivots, new skill sets"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePreview = () => {
    setStep("template");
  };

  const selectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep("preview");
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${formData.fullName || 'resume'}.pdf`);
      toast({
        title: "PDF Downloaded",
        description: "Your resume has been downloaded as PDF",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadDOCX = async () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: formData.fullName || "Your Name",
              heading: HeadingLevel.TITLE,
            }),
            new Paragraph({
              children: [
                new TextRun(`${formData.email} | ${formData.phone}`),
                formData.linkedin ? new TextRun(` | ${formData.linkedin}`) : new TextRun(""),
                formData.location ? new TextRun(` | ${formData.location}`) : new TextRun(""),
              ],
            }),
            new Paragraph({
              text: "",
            }),
            ...(formData.summary ? [
              new Paragraph({
                text: "PROFESSIONAL SUMMARY",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: formData.summary,
              }),
              new Paragraph({
                text: "",
              }),
            ] : []),
            ...(formData.skills ? [
              new Paragraph({
                text: "SKILLS",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: formData.skills,
              }),
              new Paragraph({
                text: "",
              }),
            ] : []),
            ...(formData.experience ? [
              new Paragraph({
                text: "EXPERIENCE",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: formData.experience,
              }),
              new Paragraph({
                text: "",
              }),
            ] : []),
            ...(formData.education ? [
              new Paragraph({
                text: "EDUCATION",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: formData.education,
              }),
            ] : []),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.fullName || 'resume'}.docx`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "DOCX Downloaded",
        description: "Your resume has been downloaded as Word document",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate DOCX. Please try again.",
        variant: "destructive",
      });
    }
  };

  const saveResume = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your resume",
        variant: "destructive",
      });
      return;
    }

    try {
      const resumeData = {
        title: `${formData.fullName || 'Untitled'} - ${templates.find(t => t.id === selectedTemplate)?.name}`,
        user_id: user.id,
        personal_details: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio,
          location: formData.location,
        },
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        work_experience: formData.experience ? [formData.experience] : [],
        education: formData.education ? [formData.education] : [],
        projects: formData.projects ? [formData.projects] : [],
        certifications: formData.certifications ? [formData.certifications] : [],
      };

      const { error } = await supabase
        .from('resumes')
        .insert(resumeData);

      if (error) throw error;

      toast({
        title: "Resume Saved",
        description: "Your resume has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Resume Builder</h1>
          <p className="text-muted-foreground">Create a professional resume in minutes</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === "details" ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "details" ? "bg-primary text-white" : "bg-muted"}`}>
                1
              </div>
              <span className="text-sm font-medium">Enter Details</span>
            </div>
            <div className="w-16 h-0.5 bg-border" />
            <div className={`flex items-center space-x-2 ${step === "template" ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "template" ? "bg-primary text-white" : "bg-muted"}`}>
                2
              </div>
              <span className="text-sm font-medium">Select Template</span>
            </div>
            <div className="w-16 h-0.5 bg-border" />
            <div className={`flex items-center space-x-2 ${step === "preview" ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "preview" ? "bg-primary text-white" : "bg-muted"}`}>
                3
              </div>
              <span className="text-sm font-medium">Preview & Export</span>
            </div>
          </div>
        </div>

        {step === "details" && (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <Card className="p-8 card-shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">Enter Your Details</h2>
              
              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="New York, NY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub Profile</Label>
                    <Input
                      id="github"
                      value={formData.github}
                      onChange={(e) => handleInputChange("github", e.target.value)}
                      placeholder="github.com/johndoe"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Label htmlFor="portfolio">Portfolio/Website</Label>
                    <Input
                      id="portfolio"
                      value={formData.portfolio}
                      onChange={(e) => handleInputChange("portfolio", e.target.value)}
                      placeholder="www.johndoe.com"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Professional Summary
                </h3>
                <div>
                  <Label htmlFor="summary">Professional Summary/Objective *</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    placeholder="Passionate software developer with 2+ years of experience in full-stack development..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">2-3 sentences highlighting your key strengths and career goals</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Skills & Competencies
                </h3>
                <div>
                  <Label htmlFor="skills">Technical & Soft Skills *</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    placeholder="JavaScript, React, Node.js, Python, Project Management, Communication, Problem Solving..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Separate skills with commas</p>
                </div>
              </div>

              {/* Experience & Projects */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Experience & Projects
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Work Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="Software Developer | TechCorp | 2022-Present&#10;• Developed 5+ web applications using React and Node.js&#10;• Increased user engagement by 30% through UI improvements"
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Include measurable achievements and impact</p>
                  </div>
                  <div>
                    <Label htmlFor="projects">Projects/Portfolio</Label>
                    <Textarea
                      id="projects"
                      value={formData.projects}
                      onChange={(e) => handleInputChange("projects", e.target.value)}
                      placeholder="E-commerce Platform | React, Node.js, MongoDB&#10;• Built full-stack application with user authentication&#10;• Implemented payment processing with Stripe integration"
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Academic projects, personal projects, or portfolio pieces</p>
                  </div>
                </div>
              </div>

              {/* Education & Development */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Education & Professional Development
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education">Education *</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      placeholder="Bachelor of Science in Computer Science&#10;University of Technology | 2020-2024&#10;GPA: 3.8/4.0"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coursework">Relevant Coursework/Training</Label>
                    <Textarea
                      id="coursework"
                      value={formData.coursework}
                      onChange={(e) => handleInputChange("coursework", e.target.value)}
                      placeholder="Data Structures, Algorithms, Web Development, Database Design, Machine Learning"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Bootcamps, online courses, relevant coursework</p>
                  </div>
                  <div>
                    <Label htmlFor="certifications">Certifications</Label>
                    <Textarea
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) => handleInputChange("certifications", e.target.value)}
                      placeholder="AWS Certified Developer | 2023&#10;Google Analytics Certified | 2022"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="languages">Languages</Label>
                    <Textarea
                      id="languages"
                      value={formData.languages}
                      onChange={(e) => handleInputChange("languages", e.target.value)}
                      placeholder="English (Native), Spanish (Fluent), French (Conversational)"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Additional Information</h3>
                <div>
                  <Label htmlFor="achievements">Awards & Achievements</Label>
                  <Textarea
                    id="achievements"
                    value={formData.achievements}
                    onChange={(e) => handleInputChange("achievements", e.target.value)}
                    placeholder="Dean's List (2022-2024)&#10;Hackathon Winner - TechCorp Innovation Challenge 2023&#10;Published research paper on Machine Learning applications"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={generatePreview} className="gradient-primary text-white px-8">
                  Continue to Templates
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === "template" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Choose Your Template</h2>
            <p className="text-center text-muted-foreground mb-8">Select the template that best matches your career stage and goals</p>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="p-6 card-shadow hover:card-shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] border-2 hover:border-primary/50"
                  onClick={() => selectTemplate(template.id)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-4 flex flex-col items-center justify-center p-4 border border-primary/20">
                    <FileText className="w-16 h-16 text-primary mb-2" />
                    <div className="text-center">
                      <div className="text-xs font-medium text-primary mb-1">{template.targetLength}</div>
                      <div className="text-xs text-muted-foreground">{template.bestFor}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <p className="text-xs text-muted-foreground mb-4 italic">{template.preview}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-medium text-foreground">Best for:</div>
                    <div className="text-xs text-muted-foreground">{template.bestFor}</div>
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Select {template.name}
                  </Button>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={() => setStep("details")}>
                ← Back to Details
              </Button>
            </div>
          </div>
        )}

        {step === "preview" && selectedTemplate && (
          <div className="animate-fade-in">
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8">
              {/* Live Preview */}
              <div className="xl:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Live Preview</h2>
                  <div className="text-sm text-muted-foreground">
                    {templates.find(t => t.id === selectedTemplate)?.name} Template
                  </div>
                </div>
                
                <Card className="card-shadow-lg overflow-hidden">
                  <div ref={resumeRef} className="bg-white min-h-[700px] max-h-[800px] overflow-y-auto">
                    {selectedTemplate === "fresher" && <FresherTemplate data={formData} />}
                    {selectedTemplate === "professional" && <ProfessionalTemplate data={formData} />}
                    {selectedTemplate === "career-switcher" && <CareerSwitcherTemplate data={formData} />}
                  </div>
                </Card>
              </div>

              {/* Export & Actions */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Export & Actions</h2>
                
                {/* Template Info */}
                <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
                  <div className="text-sm">
                    <div className="font-semibold text-primary mb-1">
                      {templates.find(t => t.id === selectedTemplate)?.name}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {templates.find(t => t.id === selectedTemplate)?.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Target Length: {templates.find(t => t.id === selectedTemplate)?.targetLength}
                    </div>
                  </div>
                </Card>

                {/* Export Options */}
                <div className="space-y-4 mb-6">
                  <Card className="p-4 card-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
                        <Download className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm">Download PDF</h3>
                        <p className="text-xs text-muted-foreground">ATS-friendly format</p>
                      </div>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={downloadPDF}>
                        PDF
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4 card-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm">Download DOCX</h3>
                        <p className="text-xs text-muted-foreground">Editable Word document</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" onClick={downloadDOCX}>
                        DOCX
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <Button variant="outline" className="w-full" onClick={() => setStep("template")}>
                    ← Change Template
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setStep("details")}>
                    ← Edit Details
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={saveResume}>
                    Save Resume
                  </Button>
                </div>

                {/* Tips */}
                <Card className="p-4 mt-6 bg-amber-50 border-amber-200">
                  <div className="text-xs">
                    <div className="font-semibold text-amber-800 mb-2">💡 Pro Tips:</div>
                    <ul className="text-amber-700 space-y-1">
                      <li>• Use action verbs and quantify achievements</li>
                      <li>• Keep it concise and relevant to the job</li>
                      <li>• Proofread for spelling and grammar</li>
                      <li>• Tailor your resume for each application</li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;