import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  MapPin, 
  Building, 
  Clock, 
  DollarSign, 
  ExternalLink,
  Filter,
  Search,
  Briefcase,
  Users,
  AlertCircle
} from "lucide-react";

const Jobs = () => {
  const [filters, setFilters] = useState({
    role: "",
    location: "",
    experience: ""
  });

  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      remote: true,
      salary: "$120k - $160k",
      experience: "3-5 years",
      skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML"],
      description: "Join our dynamic team to build cutting-edge user interfaces for our flagship products. You'll work with React, TypeScript, and modern CSS frameworks to create exceptional user experiences.",
      posted: "2 days ago",
      applicants: 45,
      match: 89
    },
    {
      id: 2,
      title: "React Developer",
      company: "StartupXYZ",
      location: "New York, NY",
      type: "Full-time",
      remote: false,
      salary: "$90k - $120k",
      experience: "2-4 years",
      skills: ["React", "JavaScript", "Node.js", "MongoDB"],
      description: "Help us build the next generation of web applications. We're looking for a passionate React developer to join our growing engineering team.",
      posted: "1 week ago",
      applicants: 28,
      match: 76
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "Innovation Labs",
      location: "Austin, TX",
      type: "Full-time",
      remote: true,
      salary: "$100k - $140k",
      experience: "3-6 years",
      skills: ["React", "Node.js", "Python", "PostgreSQL", "AWS"],
      description: "Work on both frontend and backend systems using modern technologies. You'll have the opportunity to architect scalable solutions and mentor junior developers.",
      posted: "3 days ago",
      applicants: 67,
      match: 82
    },
    {
      id: 4,
      title: "Frontend Developer",
      company: "Design Studio Pro",
      location: "Los Angeles, CA",
      type: "Contract",
      remote: true,
      salary: "$80 - $100/hr",
      experience: "2-5 years",
      skills: ["Vue.js", "JavaScript", "CSS", "Figma"],
      description: "Create beautiful, responsive web applications for our clients. Strong design sensibility and attention to detail required.",
      posted: "5 days ago",
      applicants: 22,
      match: 68
    },
    {
      id: 5,
      title: "Junior Web Developer",
      company: "EduTech Solutions",
      location: "Chicago, IL",
      type: "Full-time",
      remote: false,
      salary: "$60k - $80k",
      experience: "0-2 years",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      description: "Perfect opportunity for a recent graduate or career changer. You'll work alongside senior developers to build educational web applications.",
      posted: "4 days ago",
      applicants: 15,
      match: 91
    },
    {
      id: 6,
      title: "Senior Full Stack Developer",
      company: "FinTech Innovations",
      location: "Boston, MA",
      type: "Full-time",
      remote: true,
      salary: "$130k - $170k",
      experience: "5+ years",
      skills: ["React", "TypeScript", "Python", "Django", "PostgreSQL"],
      description: "Lead the development of secure financial applications. Experience with fintech regulations and compliance is a plus.",
      posted: "1 day ago",
      applicants: 89,
      match: 85
    }
  ];

  const getMatchColor = (match: number) => {
    if (match >= 85) return "text-success bg-success/10 border-success/20";
    if (match >= 70) return "text-warning bg-warning/10 border-warning/20";
    return "text-muted-foreground bg-muted/10 border-muted/20";
  };

  const filteredJobs = mockJobs.filter(job => {
    if (filters.role && !job.title.toLowerCase().includes(filters.role.toLowerCase())) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.experience) {
      const experienceMap: Record<string, string[]> = {
        "entry": ["0-2 years", "1-3 years"],
        "mid": ["2-4 years", "3-5 years", "2-5 years"],
        "senior": ["3-6 years", "5+ years", "4+ years"]
      };
      if (!experienceMap[filters.experience]?.includes(job.experience)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Job Matches</h1>
          <p className="text-muted-foreground">Discover opportunities that match your skills and experience</p>
        </div>

        {/* Demo Banner */}
        <Card className="p-4 mb-8 bg-warning/5 border-warning/20">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-warning font-medium">
              Demo Mode: These job listings are for demonstration purposes only and are not real job opportunities.
            </p>
          </div>
        </Card>

        {/* Filters */}
        <Card className="p-6 mb-8 card-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Filter Jobs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
              <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any role</SelectItem>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="full stack">Full Stack Developer</SelectItem>
                  <SelectItem value="react">React Developer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any location</SelectItem>
                  <SelectItem value="san francisco">San Francisco, CA</SelectItem>
                  <SelectItem value="new york">New York, NY</SelectItem>
                  <SelectItem value="austin">Austin, TX</SelectItem>
                  <SelectItem value="los angeles">Los Angeles, CA</SelectItem>
                  <SelectItem value="chicago">Chicago, IL</SelectItem>
                  <SelectItem value="boston">Boston, MA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Experience Level</label>
              <Select value={filters.experience} onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any level</SelectItem>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredJobs.length} of {mockJobs.length} jobs
          </p>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            <span>Sorted by match score</span>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="p-6 card-shadow hover:card-shadow-lg transition-all duration-300">
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
                          {job.remote && (
                            <Badge variant="outline" className="ml-1 text-xs">Remote</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={`font-bold ${getMatchColor(job.match)}`}>
                      {job.match}% Match
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.posted}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{job.applicants} applicants</span>
                      </div>
                    </div>
                    <Button className="gradient-primary text-white">
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="p-12 text-center card-shadow">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
            <Button variant="outline" onClick={() => setFilters({ role: "", location: "", experience: "" })}>
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Jobs;