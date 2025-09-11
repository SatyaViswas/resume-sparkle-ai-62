import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FileText, Download, Eye } from "lucide-react";

const ResumeBuilder = () => {
  const [step, setStep] = useState<"details" | "template" | "preview">("details");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
    projects: "",
    summary: "",
  });

  const templates = [
    {
      id: "fresher",
      name: "Fresher",
      description: "Perfect for new graduates and entry-level positions",
      preview: "Clean, modern layout with emphasis on education and projects"
    },
    {
      id: "professional",
      name: "Professional",
      description: "Ideal for experienced professionals",
      preview: "Classic design with focus on work experience and achievements"
    },
    {
      id: "career-switcher",
      name: "Career Switcher",
      description: "Great for transitioning to new industries",
      preview: "Skills-focused layout highlighting transferable abilities"
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

  return (
    <div className="min-h-screen bg-background">
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
          <div className="max-w-4xl mx-auto animate-fade-in">
            <Card className="p-8 card-shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">Enter Your Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                      placeholder="JavaScript, React, Node.js, Python..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      placeholder="Bachelor of Science in Computer Science, University of Technology, 2020-2024"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="Software Developer at TechCorp (2022-Present)..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="projects">Projects</Label>
                    <Textarea
                      id="projects"
                      value={formData.projects}
                      onChange={(e) => handleInputChange("projects", e.target.value)}
                      placeholder="E-commerce Platform - Built with React and Node.js..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    placeholder="Passionate software developer with 2+ years of experience..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <Button onClick={generatePreview} className="gradient-primary text-white px-8">
                  Generate Preview
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === "template" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Choose Your Template</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="p-6 card-shadow hover:card-shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => selectTemplate(template.id)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted rounded-lg mb-4 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <p className="text-xs text-muted-foreground">{template.preview}</p>
                  <Button variant="outline" className="w-full mt-4">
                    Select Template
                  </Button>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={() => setStep("details")}>
                Back to Details
              </Button>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Live Preview */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Live Preview</h2>
                <Card className="p-8 card-shadow-lg bg-white min-h-[600px]">
                  <div className="space-y-6">
                    <div className="text-center border-b border-gray-200 pb-4">
                      <h1 className="text-2xl font-bold text-gray-900">{formData.fullName || "Your Name"}</h1>
                      <p className="text-gray-600">{formData.email} | {formData.phone}</p>
                    </div>
                    
                    {formData.summary && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
                        <p className="text-sm text-gray-700">{formData.summary}</p>
                      </div>
                    )}
                    
                    {formData.experience && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{formData.experience}</p>
                      </div>
                    )}
                    
                    {formData.education && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Education</h2>
                        <p className="text-sm text-gray-700">{formData.education}</p>
                      </div>
                    )}
                    
                    {formData.skills && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
                        <p className="text-sm text-gray-700">{formData.skills}</p>
                      </div>
                    )}
                    
                    {formData.projects && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Projects</h2>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{formData.projects}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Export Options */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Export Options</h2>
                <div className="space-y-4">
                  <Card className="p-6 card-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-danger/20 to-danger/10 flex items-center justify-center">
                        <Download className="w-6 h-6 text-danger" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">Download PDF</h3>
                        <p className="text-sm text-muted-foreground">High-quality PDF for job applications</p>
                      </div>
                      <Button className="bg-danger text-white hover:bg-danger/90">
                        Download PDF
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6 card-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">Download DOC</h3>
                        <p className="text-sm text-muted-foreground">Editable Word document</p>
                      </div>
                      <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                        Download DOC
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="flex space-x-4 mt-8">
                  <Button variant="outline" onClick={() => setStep("template")}>
                    Change Template
                  </Button>
                  <Button variant="outline" onClick={() => setStep("details")}>
                    Edit Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;