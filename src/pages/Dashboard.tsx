import Navbar from "@/components/Navbar";
import MetricCard from "@/components/MetricCard";
import ActionCard from "@/components/ActionCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingUp, 
  FileText, 
  Target, 
  Upload, 
  Compass, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    lastScore: 0,
    totalAnalyses: 0,
    careerPaths: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load recent resume scans
      const { data: scans } = await supabase
        .from('resume_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (scans && scans.length > 0) {
        setMetrics({
          lastScore: scans[0]?.ats_score || 0,
          totalAnalyses: scans.length,
          careerPaths: 8 // Static for now
        });

        // Create recent activity from scans
        const activities = scans.slice(0, 3).map((scan, index) => ({
          type: "analysis",
          title: "Resume analyzed",
          description: `Score: ${scan.ats_score}%`,
          time: new Date(scan.created_at).toLocaleDateString(),
          icon: <TrendingUp className="w-4 h-4 text-success" />,
        }));

        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const recentActivities = [
    {
      type: "analysis",
      title: "Resume analyzed",
      description: "Score improved to 84%",
      time: "2 hours ago",
      icon: <TrendingUp className="w-4 h-4 text-success" />,
    },
    {
      type: "career",
      title: "New career path discovered",
      description: "Frontend Developer - 89% match",
      time: "1 day ago",
      icon: <Target className="w-4 h-4 text-secondary" />,
    },
    {
      type: "interview",
      title: "Interview practice completed",
      description: "7 questions answered",
      time: "3 days ago",
      icon: <MessageSquare className="w-4 h-4 text-warning" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="hero-gradient rounded-2xl p-8 mb-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Welcome to Resume Mentor 👋
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Here's a quick overview of your resume journey and career progress.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Last Resume Score"
            value={metrics.lastScore ? `${metrics.lastScore}%` : "No data"}
            icon={<TrendingUp className="w-6 h-6 text-success" />}
            trend={metrics.lastScore > 0 ? { value: "Latest analysis", isPositive: true } : undefined}
            className="animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          />
          <MetricCard
            title="Total Resumes Analyzed"
            value={metrics.totalAnalyses.toString()}
            subtitle={user ? "Your analyses" : "Demo data"}
            icon={<FileText className="w-6 h-6 text-secondary" />}
            className="animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          />
          <MetricCard
            title="Career Paths Suggested"
            value={metrics.careerPaths.toString()}
            subtitle="Based on skills"
            icon={<Target className="w-6 h-6 text-primary" />}
            className="animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard
              title="Upload Resume"
              description="Get instant ATS analysis and improvement suggestions"
              icon={<Upload />}
              color="primary"
              onClick={() => navigate("/analyze")}
              className="animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            />
            <ActionCard
              title="Explore Career Paths"
              description="Discover new opportunities based on your skills"
              icon={<Compass />}
              color="secondary"
              onClick={() => navigate("/analyze")}
              className="animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            />
            <ActionCard
              title="Practice Interview"
              description="Prepare with AI-powered interview questions"
              icon={<MessageSquare />}
              color="success"
              onClick={() => navigate("/interviewer")}
              className="animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="animate-slide-up" style={{ animationDelay: "0.7s" }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
          <div className="bg-card border border-card-border rounded-xl card-shadow">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`p-6 flex items-center space-x-4 ${
                    index !== recentActivity.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {activity.time}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No recent activity. Upload a resume to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;