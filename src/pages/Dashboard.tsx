import Navbar from "@/components/Navbar";
import MetricCard from "@/components/MetricCard";
import ActionCard from "@/components/ActionCard";
import { useNavigate } from "react-router-dom";
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
            value="84%"
            icon={<TrendingUp className="w-6 h-6 text-success" />}
            trend={{ value: "+12% from last review", isPositive: true }}
            className="animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          />
          <MetricCard
            title="Total Resumes Analyzed"
            value="27"
            subtitle="5 this month"
            icon={<FileText className="w-6 h-6 text-secondary" />}
            className="animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          />
          <MetricCard
            title="Career Paths Suggested"
            value="8"
            subtitle="3 new matches"
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
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className={`p-6 flex items-center space-x-4 ${
                  index !== recentActivities.length - 1 ? "border-b border-border" : ""
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;