import { Mail, Phone, Linkedin, Github, MapPin, Globe } from "lucide-react";

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  location: string;
  summary: string;
  education: string;
  skills: string;
  projects: string;
  coursework: string;
  certifications: string;
  achievements: string;
  experience: string;
  languages: string;
}

interface ProfessionalTemplateProps {
  data: ResumeData;
}

export const ProfessionalTemplate = ({ data }: ProfessionalTemplateProps) => {
  const formatSkills = (skills: string) => {
    return skills.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  return (
    <div className="bg-white p-8 text-black font-sans text-sm leading-relaxed max-w-[8.5in] mx-auto">
      {/* Header */}
      <div className="border-b-2 border-blue-700 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">{data.fullName || "Your Full Name"}</h1>
        <div className="flex flex-wrap gap-4 text-xs text-gray-700">
          {data.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{data.phone}</span>
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              <span>{data.linkedin}</span>
            </div>
          )}
          {data.github && (
            <div className="flex items-center gap-1">
              <Github className="w-3 h-3" />
              <span>{data.github}</span>
            </div>
          )}
          {data.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>{data.portfolio}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{data.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-700 mb-3 tracking-wide">PROFESSIONAL SUMMARY</h2>
          <p className="text-xs leading-relaxed text-gray-800">{data.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-700 mb-3 tracking-wide">PROFESSIONAL EXPERIENCE</h2>
          <div className="text-xs leading-relaxed text-gray-800 whitespace-pre-line">{data.experience}</div>
        </div>
      )}

      {/* Core Competencies */}
      {data.skills && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-700 mb-3 tracking-wide">CORE COMPETENCIES</h2>
          <div className="grid grid-cols-3 gap-2">
            {formatSkills(data.skills).map((skill, index) => (
              <div key={index} className="text-xs text-gray-800 flex items-center">
                <span className="w-1 h-1 bg-blue-700 rounded-full mr-2"></span>
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Projects */}
      {data.projects && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-700 mb-3 tracking-wide">KEY PROJECTS</h2>
          <div className="text-xs leading-relaxed text-gray-800 whitespace-pre-line">{data.projects}</div>
        </div>
      )}

      {/* Education */}
      {data.education && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-700 mb-3 tracking-wide">EDUCATION</h2>
          <div className="text-xs leading-relaxed text-gray-800 whitespace-pre-line">{data.education}</div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-700 mb-3 tracking-wide">CERTIFICATIONS</h2>
          <div className="text-xs leading-relaxed text-gray-800 whitespace-pre-line">{data.certifications}</div>
        </div>
      )}

      {/* Achievements */}
      {data.achievements && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-700 mb-3 tracking-wide">ACHIEVEMENTS & AWARDS</h2>
          <div className="text-xs leading-relaxed text-gray-800 whitespace-pre-line">{data.achievements}</div>
        </div>
      )}

      {/* Languages */}
      {data.languages && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-700 mb-3 tracking-wide">LANGUAGES</h2>
          <div className="text-xs leading-relaxed text-gray-800">{data.languages}</div>
        </div>
      )}
    </div>
  );
};