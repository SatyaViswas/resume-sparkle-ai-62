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
}

interface FresherTemplateProps {
  data: ResumeData;
}

export const FresherTemplate = ({ data }: FresherTemplateProps) => {
  const formatSkills = (skills: string) => {
    return skills.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  return (
    <div className="bg-white p-8 text-black font-sans text-sm leading-relaxed max-w-[8.5in] mx-auto">
      {/* Header */}
      <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
        <h1 className="text-xl font-bold text-black mb-2">{data.fullName || "Your Full Name"}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-700">
          {data.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">{data.email}</a>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <a href={`tel:${data.phone}`} className="text-blue-600 hover:underline">{data.phone}</a>
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.linkedin}</a>
            </div>
          )}
          {data.github && (
            <div className="flex items-center gap-1">
              <Github className="w-3 h-3" />
              <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.github}</a>
            </div>
          )}
          {data.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <a href={data.portfolio.startsWith('http') ? data.portfolio : `https://${data.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{data.portfolio}</a>
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

      {/* Career Objective */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-600 mb-2 tracking-wide">CAREER OBJECTIVE</h2>
          <p className="text-xs leading-relaxed text-gray-800">{data.summary}</p>
        </div>
      )}

      {/* Education */}
      {data.education && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-600 mb-2 tracking-wide">EDUCATION</h2>
          <div className="text-xs leading-relaxed text-gray-800 whitespace-pre-line">{data.education}</div>
          
          {/* Relevant Coursework */}
          {data.coursework && (
            <div className="mt-3">
              <h3 className="text-xs font-semibold text-black mb-1">Relevant Coursework:</h3>
              <p className="text-xs text-gray-800">{data.coursework}</p>
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {data.skills && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-600 mb-2 tracking-wide">TECHNICAL SKILLS</h2>
          <div className="flex flex-wrap gap-1">
            {formatSkills(data.skills).map((skill, index) => (
              <span key={index} className="text-xs text-gray-800">
                {skill}{index < formatSkills(data.skills).length - 1 ? ' •' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Academic Projects */}
      {data.projects && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-600 mb-2 tracking-wide">ACADEMIC PROJECTS</h2>
          <div className="text-xs leading-relaxed text-gray-800 whitespace-pre-line">{data.projects}</div>
        </div>
      )}

      {/* Experience (Internships) */}
      {data.experience && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-600 mb-2 tracking-wide">INTERNSHIPS & EXPERIENCE</h2>
          <div className="text-xs leading-relaxed text-gray-800 whitespace-pre-line">{data.experience}</div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-600 mb-2 tracking-wide">CERTIFICATIONS</h2>
          <div className="text-xs leading-relaxed text-gray-800 whitespace-pre-line">{data.certifications}</div>
        </div>
      )}

      {/* Achievements */}
      {data.achievements && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-blue-600 mb-2 tracking-wide">ACHIEVEMENTS & AWARDS</h2>
          <div className="text-xs leading-relaxed text-gray-800 whitespace-pre-line">{data.achievements}</div>
        </div>
      )}
    </div>
  );
};