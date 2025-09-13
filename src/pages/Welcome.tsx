import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, FileText, Target, Users } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white">Resume Mentor</h1>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          AI-powered resume feedback, career paths, jobs, and interview prep
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <Brain className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
            <p className="text-white/80 text-sm">Smart resume feedback with ATS optimization</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <Target className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Career Paths</h3>
            <p className="text-white/80 text-sm">Discover new opportunities based on your skills</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <Users className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Interview Prep</h3>
            <p className="text-white/80 text-sm">Practice with AI-generated questions</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <FileText className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Job Matching</h3>
            <p className="text-white/80 text-sm">Find roles that match your profile</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white font-semibold px-8 py-6 text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/auth")}
          >
            Sign In / Sign Up
          </Button>
        </div>

        {/* Bottom note */}
        <p className="text-white/70 text-sm mt-8">
          Sign up to save your analyses and track progress over time
        </p>
      </div>
    </div>
  );
};

export default Welcome;