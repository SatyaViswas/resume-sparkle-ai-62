import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  TrendingUp, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Compass,
  Wrench
} from "lucide-react";

const History = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    bestScore: 0,
    improvement: 0,
    thisMonth: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadHistoryData();
    }
  }, [user]);

  const loadHistoryData = async () => {
    if (!user) return;

    try {
      const { data: scans } = await supabase
        .from('resume_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (scans) {
        setHistoryData(scans);
        
        // Calculate stats
        const scores = scans.map(scan => scan.ats_score || 0);
        const bestScore = Math.max(...scores, 0);
        const firstScore = scores[scores.length - 1] || 0;
        const lastScore = scores[0] || 0;
        const improvement = lastScore - firstScore;
        
        const thisMonth = scans.filter(scan => {
          const scanDate = new Date(scan.created_at);
          const now = new Date();
          return scanDate.getMonth() === now.getMonth() && 
                 scanDate.getFullYear() === now.getFullYear();
        }).length;

        setStats({
          total: scans.length,
          bestScore,
          improvement: Math.max(improvement, 0),
          thisMonth
        });
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

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

  const exportToPDF = (item: any) => {
    const analysis = item.analysis || {};
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume Analysis - ${item.original_filename}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #eee;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .score {
              font-size: 3em;
              font-weight: bold;
              color: #22c55e;
              margin: 10px 0;
            }
            .section {
              margin-bottom: 30px;
              padding: 20px;
              border: 1px solid #eee;
              border-radius: 8px;
            }
            .section h3 {
              color: #1f2937;
              margin-bottom: 15px;
              font-size: 1.2em;
            }
            .list-item {
              margin-bottom: 8px;
              padding-left: 15px;
              position: relative;
            }
            .list-item:before {
              content: "•";
              position: absolute;
              left: 0;
              color: #6b7280;
            }
            .strengths .list-item:before { color: #22c55e; }
            .weaknesses .list-item:before { color: #f59e0b; }
            .improvements .list-item:before { color: #3b82f6; }
            .meta {
              background: #f9fafb;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            @media print {
              body { margin: 0; padding: 15px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Resume Analysis Report</h1>
            <div class="meta">
              <strong>File:</strong> ${item.original_filename}<br>
              <strong>Analysis Date:</strong> ${new Date(item.created_at).toLocaleDateString()}<br>
              <strong>Generated by:</strong> AI Resume Analyzer
            </div>
            <div class="score">${item.ats_score || 0}%</div>
            <p>ATS Compatibility Score</p>
          </div>

          <div class="section strengths">
            <h3>✅ Strengths</h3>
            ${(analysis.strengths || []).map(strength => 
              `<div class="list-item">${strength}</div>`
            ).join('')}
          </div>

          <div class="section weaknesses">
            <h3>⚠️ Areas for Improvement</h3>
            ${(analysis.weaknesses || []).map(weakness => 
              `<div class="list-item">${weakness}</div>`
            ).join('')}
          </div>

          <div class="section improvements">
            <h3>🔧 Recommended Improvements</h3>
            ${(item.suggestions || analysis.improvements || []).map(improvement => 
              `<div class="list-item">${improvement}</div>`
            ).join('')}
          </div>

          <div class="section">
            <h3>📋 Analysis Summary</h3>
            <p>This resume analysis was generated using AI technology to help optimize your resume for Applicant Tracking Systems (ATS) and improve your job application success rate.</p>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 100);
              }, 500);
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
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
                <p className="text-2xl font-bold text-success">{stats.bestScore}%</p>
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
                <p className="text-2xl font-bold text-secondary">+{stats.improvement}%</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.thisMonth}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* History Timeline */}
        <div className="space-y-4">
          {historyData.length > 0 ? (
            historyData.map((item, index) => {
              const analysis = item.analysis || {};
              return (
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
                            <h3 className="text-lg font-semibold text-foreground">{item.original_filename}</h3>
                            <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-4 h-4" />
                              <span className="font-medium text-success">
                                ATS Score: {item.ats_score || 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Resume Analysis - {item.original_filename}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 mt-4">
                              {/* ATS Score */}
                              <Card className="p-6 text-center">
                                <div className="flex items-center justify-center space-x-3 mb-4">
                                  <Compass className="w-8 h-8 text-secondary" />
                                  <h3 className="text-2xl font-bold">ATS Score</h3>
                                </div>
                                <div className="text-5xl font-bold text-foreground mb-2">{item.ats_score || 0}%</div>
                                <p className="text-muted-foreground">Resume ATS Compatibility</p>
                              </Card>

                              <div className="grid md:grid-cols-2 gap-6">
                                {/* Strengths */}
                                <Card className="p-6">
                                  <div className="flex items-center space-x-3 mb-4">
                                    <CheckCircle className="w-6 h-6 text-success" />
                                    <h3 className="text-lg font-semibold">Strengths</h3>
                                  </div>
                                  <ul className="space-y-2">
                                    {(analysis.strengths || []).map((strength, i) => (
                                      <li key={i} className="text-sm text-muted-foreground flex items-start space-x-2">
                                        <span className="w-1 h-1 bg-success rounded-full mt-2 flex-shrink-0" />
                                        <span>{strength}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </Card>

                                {/* Weaknesses */}
                                <Card className="p-6">
                                  <div className="flex items-center space-x-3 mb-4">
                                    <AlertTriangle className="w-6 h-6 text-warning" />
                                    <h3 className="text-lg font-semibold">Areas for Improvement</h3>
                                  </div>
                                  <ul className="space-y-2">
                                    {(analysis.weaknesses || []).map((weakness, i) => (
                                      <li key={i} className="text-sm text-muted-foreground flex items-start space-x-2">
                                        <span className="w-1 h-1 bg-warning rounded-full mt-2 flex-shrink-0" />
                                        <span>{weakness}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </Card>
                              </div>

                              {/* Improvements */}
                              <Card className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                  <Wrench className="w-6 h-6 text-primary" />
                                  <h3 className="text-lg font-semibold">Recommended Improvements</h3>
                                </div>
                                <ul className="space-y-2">
                                  {(item.suggestions || analysis.improvements || []).map((improvement, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start space-x-2">
                                      <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                                      <span>{improvement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </Card>

                              {/* Analysis Date */}
                              <div className="text-center text-sm text-muted-foreground">
                                Analysis completed on {new Date(item.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => exportToPDF(item)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setExpandedItems(prev => 
                              prev.includes(index) 
                                ? prev.filter(i => i !== index)
                                : [...prev, index]
                            );
                          }}
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
                                  {(analysis.strengths || []).map((strength: string, i: number) => (
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
                                  {(analysis.weaknesses || []).map((weakness: string, i: number) => (
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
                            <h4 className="font-semibold text-foreground mb-3">Suggestions</h4>
                            <div className="space-y-2">
                              {(item.suggestions || []).map((suggestion: string, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                  <span className="text-sm text-foreground">{suggestion}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-12 text-center card-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No analysis history</h3>
              <p className="text-muted-foreground mb-4">Upload your first resume to get started</p>
              <Button onClick={() => window.location.href = '/analyze'}>
                Upload Resume
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;