import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        if (rememberMe) {
          // Store session persistence preference
          localStorage.setItem('supabase-remember-me', 'true');
        }
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ResuMate
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your account to get started" : "Welcome back! Sign in to continue"}
          </p>
        </div>

        {/* Auth Card */}
        <Card className="p-8 card-shadow-lg animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="text-sm font-medium text-foreground mb-2 block">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember-me" className="text-sm text-foreground cursor-pointer">
                  Remember me
                </label>
              </div>
            )}

            <Button 
              type="submit" 
              variant="yellow"
              size="lg"
              className="w-full font-semibold px-8 py-6 text-lg"
              disabled={loading}
            >
              {loading ? "Loading..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-primary-dark font-medium hover:underline transition-colors"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;