import AppHeader from "@/components/AppHeader";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Wrench, 
  AlertTriangle, 
  RefreshCw, 
  Clock,
  CheckCircle,
  Target
} from "lucide-react";

const Interviewer = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "DevOps Engineer",
    "Software Engineer",
    "Mobile Developer",
    "QA Engineer"
  ];

  const generateQuestions = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('generate-interview-questions', {
        body: {
          userId: user?.id || null,
          resumeText: null, // No resume text from this page
          targetRole: selectedRole
        }
      });

      if (error) throw error;

      if (data.success) {
        const formattedQuestions = data.questions.map((question: string, index: number) => ({
          id: index + 1,
          type: index % 3 === 0 ? "Behavioral" : (index % 3 === 1 ? "Technical" : "Situational"),
          question: question,
          icon: index % 3 === 0 ? <MessageSquare className="w-5 h-5" /> : 
                (index % 3 === 1 ? <Wrench className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />),
          difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
          timeLimit: ["3-4 minutes", "4-5 minutes", "5-7 minutes"][Math.floor(Math.random() * 3)]
        }));
        
        setQuestions(formattedQuestions);
        setAnswers({});
        toast({
          title: "Questions generated!",
          description: `Generated ${data.questions.length} interview questions for ${selectedRole}.`,
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
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-success bg-success/10 border-success/20";
      case "Medium": return "text-warning bg-warning/10 border-warning/20";
      case "Hard": return "text-danger bg-danger/10 border-danger/20";
      default: return "text-muted-foreground bg-muted/10 border-muted/20";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Behavioral": return "text-primary bg-primary/10 border-primary/20";
      case "Technical": return "text-secondary bg-secondary/10 border-secondary/20";
      case "Situational": return "text-warning bg-warning/10 border-warning/20";
      default: return "text-muted-foreground bg-muted/10 border-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Interview Prep</h1>
          <p className="text-muted-foreground">Practice with AI-generated interview questions tailored to your target role</p>
        </div>

        {/* Role Selection */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="p-6 card-shadow-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Select Your Target Role</h2>
            <p className="text-muted-foreground mb-6">Choose the position you're preparing for to get relevant questions</p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Choose a role..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={generateQuestions}
                disabled={!selectedRole || isLoading}
                className="gradient-primary text-white px-8"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Questions
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <RefreshCw className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Generating Interview Questions</h3>
            <p className="text-muted-foreground">Creating personalized questions for {selectedRole}...</p>
          </div>
        )}

        {/* Questions */}
        {questions.length > 0 && !isLoading && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Interview Questions</h2>
                <p className="text-muted-foreground">Prepared for: <span className="font-medium text-primary">{selectedRole}</span></p>
              </div>
              <Button variant="outline" onClick={generateQuestions}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Set
              </Button>
            </div>

            <div className="grid gap-6">
              {questions.map((question, index) => (
                <Card key={question.id} className="p-6 card-shadow hover:card-shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                      {question.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-bold text-muted-foreground">Q{index + 1}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getTypeColor(question.type)}`}>
                          {question.type}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{question.timeLimit}</span>
                        </div>
                      </div>
                       <p className="text-foreground font-medium text-lg leading-relaxed">{question.question}</p>
                     </div>
                   </div>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <Card className="p-6 card-shadow-lg mt-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">Practice Complete!</h3>
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div>
                  <p className="text-2xl font-bold text-primary">{questions.length}</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
                 <div>
                   <p className="text-2xl font-bold text-success">{questions.length}</p>
                   <p className="text-sm text-muted-foreground">Generated</p>
                 </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">{selectedRole}</p>
                  <p className="text-sm text-muted-foreground">Target Role</p>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={generateQuestions}>
                  Practice Again
                </Button>
                <Button className="gradient-primary text-white">
                  Review Answers
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interviewer;