import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Resume Reviewer", path: "/analyze" },
    { name: "Resume Builder", path: "/builder" },
    { name: "History", path: "/history" },
    { name: "Interviewer", path: "/interviewer" },
    { name: "Jobs", path: "/jobs" },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 card-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Removed to avoid duplication with AppHeader */}

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={location.pathname === item.path ? "gradient-primary text-white" : ""}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      location.pathname === item.path ? "gradient-primary text-white" : ""
                    }`}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;