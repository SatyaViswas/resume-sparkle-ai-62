import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  Calendar, 
  TrendingUp, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Download,
  Eye
} from "lucide-react";

const History = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const historyData = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      fileName: "john_doe_resume_v3.pdf",
      atsScore: 84,
      status: "completed",
      analysis: {
        strengths: ["Strong technical skills", "Clear project descriptions", "Professional formatting"],
        weaknesses: ["Missing keywords", "Lacks quantifiable results", "No soft skills mentioned"],
        improvements: ["Add industry keywords", "Include performance metrics", "Highlight leadership experience"]
      },
      careerPaths: [
        { title: "Frontend Developer", match: 89 },
        { title: "Full Stack Developer", match: 76 },
        { title: "UI/UX Developer", match: 68 }
      ]
    },
    {
      id: 2,
      date: "2024-01-12",
      time: "09:15",
      fileName: "john_doe_resume_v2.pdf",
      atsScore: 72,
      status: "completed",
      analysis: {
        strengths: ["Good education section", "Relevant work experience", "Clean layout"],
        weaknesses: ["Weak summary section", "Outdated skills", "Generic descriptions"],
        improvements: ["Modernize skill set", "Strengthen professional summary", "Add specific achievements"]
      },
      careerPaths: [
        { title: "Software Developer", match: 73 },
        { title: "Web Developer", match: 68 },
        { title: "Junior Developer", match: 82 }
      ]
    },
    {
      id: 3,
      date: "2024-01-08",
      time: "16:45",
      fileName: "john_doe_resume_v1.pdf",
      atsScore: 58,
      status: "completed",
      analysis: {
        strengths: ["Basic structure present", "Contact information complete"],
        weaknesses: ["Poor formatting", "Limited work experience", "No technical skills listed"],
        improvements: ["Improve overall formatting", "Add technical skills section", "Expand project descriptions"]
      },
      careerPaths: [
        { title: "Entry Level Developer", match: 65 },
        { title: "Intern", match: 78 },
        { title: "Junior Analyst", match: 52 }
      ]
    },
    {
      id: 4,
      date: "2024-01-05",
      time: "11:20",
      fileName: "resume_draft.pdf",
      atsScore: 45,
      status: "needs_improvement",
      analysis: {
        strengths: ["Basic information present"],
        weaknesses: ["Very poor formatting", "Incomplete sections", "No quantifiable achievements"],
        improvements: ["Complete all sections", "Professional formatting", "Add measurable results"]
      },
      careerPaths: [
        { title: "Trainee Position", match: 45 },
        { title: "Administrative Role", match: 38 }
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case "needs_improvement":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Needs Improvement</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analysis History</h1>
          <p className="text-muted-foreground">View and manage your previous resume analyses</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 card-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
                <p className="text-2xl font-bold text-foreground">4</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 card-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Score</p>
                <p className="text-2xl font-bold text-success">84%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 card-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <p className="text-2xl font-bold text-secondary">+39%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 card-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
            </div>
          </Card>
        </div>

        {/* History Timeline */}
        <div className="space-y-4">
          {historyData.map((item, index) => (
            <Card key={item.id} className="card-shadow hover:card-shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary" />
                      {index !== historyData.length - 1 && (
                        <div className="w-0.5 h-12 bg-border mt-2" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{item.fileName}</h3>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{item.date} at {item.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className={`font-medium ${getScoreColor(item.atsScore)}`}>
                            ATS Score: {item.atsScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(index)}
                    >
                      {expandedItems.includes(index) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedItems.includes(index) && (
                  <div className="mt-6 pt-6 border-t border-border animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Analysis Summary</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-success mb-1">Strengths:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {item.analysis.strengths.map((strength, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <span className="w-1 h-1 bg-success rounded-full mt-2 flex-shrink-0" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-warning mb-1">Areas for Improvement:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {item.analysis.weaknesses.map((weakness, i) => (
                                <li key={i} className="flex items-start space-x-2">
                                  <span className="w-1 h-1 bg-warning rounded-full mt-2 flex-shrink-0" />
                                  <span>{weakness}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Career Path Matches</h4>
                        <div className="space-y-2">
                          {item.careerPaths.map((path, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <span className="text-sm font-medium text-foreground">{path.title}</span>
                              <span className="text-sm font-bold text-primary">{path.match}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;