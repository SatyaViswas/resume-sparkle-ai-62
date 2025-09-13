import AppHeader from "@/components/AppHeader";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  ExternalLink,
  Filter,
  Search,
  Briefcase,
  AlertCircle
} from "lucide-react";

const Jobs = () => {
  const [filters, setFilters] = useState({
    role: "",
    location: "",
    experience: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const searchJobs = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a job title or keywords to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-jobs', {
        body: {
          query: searchQuery,
          location: filters.location,
          experience_level: filters.experience
        }
      });

      if (error) throw error;

      if (data.success) {
        setJobs(data.jobs || []);
        if (data.message) {
          toast({
            title: "Search completed",
            description: data.message,
          });
        }
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Job search error:', error);
      toast({
        title: "Search failed",
        description: "Using demo jobs. Please try again later.",
        variant: "destructive",
      });
      setJobs([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 85) return "text-success bg-success/10 border-success/20";
    if (match >= 70) return "text-warning bg-warning/10 border-warning/20";
    return "text-muted-foreground bg-muted/10 border-muted/20";
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Job Search</h1>
          <p className="text-muted-foreground">Search for jobs using real-time data</p>
        </div>

        {/* Demo Banner */}
        <Card className="p-4 mb-8 bg-warning/5 border-warning/20">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-warning font-medium">
              Live job search powered by JSearch API
            </p>
          </div>
        </Card>

        {/* Search Section */}
        <Card className="p-6 mb-8 card-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Search Jobs</h2>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Enter job title or keywords (e.g., React Developer, Frontend)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchJobs()}
              />
            </div>
            <Button 
              onClick={searchJobs} 
              disabled={isSearching}
              className="gradient-primary text-white"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {jobs.length} jobs {searchQuery && `for "${searchQuery}"`}
          </p>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            <span>Live job search</span>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <Card key={job.id || index} className="p-6 card-shadow hover:card-shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{job.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`font-bold ${getMatchColor(job.match_score || 75)}`}>
                        {job.match_score || 75}% Match
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{job.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">{job.salary || 'Competitive'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'Recently'}</span>
                        </div>
                      </div>
                      <Button 
                        className="gradient-primary text-white"
                        onClick={() => window.open(job.apply_link, '_blank')}
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center card-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'Enter a search term to find jobs'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setJobs([]);
                }}
              >
                Clear Search
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;