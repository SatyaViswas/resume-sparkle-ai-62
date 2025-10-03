// Test the intelligent skills extraction function directly

const testResume = `Sarah Johnson
Marketing Manager | Digital Strategy Expert
Email: sarah.johnson@email.com | Phone: (555) 123-4567 | LinkedIn | Portfolio

PROFESSIONAL SUMMARY
Results-driven Marketing Manager with 5+ years of experience in digital marketing, team leadership, and strategic campaign development. Proven track record of increasing ROI by 40% through data-driven marketing initiatives and cross-functional collaboration.

CORE COMPETENCIES
• Digital Marketing Strategy: SEO/SEM, Social Media Marketing, Content Marketing, Email Campaigns
• Analytics & Data: Google Analytics, Facebook Insights, Marketing Automation, A/B Testing
• Leadership & Management: Team Leadership (8+ members), Budget Management ($500k+), Project Management
• Creative Tools: Adobe Creative Suite, Canva, Video Editing, Graphic Design
• Marketing Technology: HubSpot, Salesforce, Mailchimp, Hootsuite

PROFESSIONAL EXPERIENCE

Senior Marketing Manager                                                        Jan 2021 – Present
GrowthTech Solutions, San Francisco, CA
• Lead integrated marketing campaigns for B2B SaaS products, managing $500k annual budget
• Increased qualified leads by 65% through strategic content marketing and SEO optimization
• Manage team of 8 marketing professionals across content, design, and digital channels
• Implemented marketing automation workflows, improving lead nurturing efficiency by 45%
• Collaborate with sales team to align marketing qualified leads with revenue targets`;

// Copy of the intelligent skills extraction function from the edge function
function extractSkillsFromText(resumeText) {
  const text = resumeText.toLowerCase();
  const skills = [];
  
  // Technical skills patterns
  const technicalSkills = [
    // Programming Languages
    'javascript', 'python', 'java', 'typescript', 'react', 'vue.js', 'angular', 'node.js',
    'html5', 'css3', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'c++', 'c#', 'scala',
    // Frameworks and Libraries  
    'express', 'django', 'flask', 'spring', 'laravel', 'redux', 'vue', 'svelte', 'bootstrap',
    'tailwind', 'sass', 'less', 'webpack', 'vite', 'next.js', 'nuxt.js', 'gatsby',
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra', 'elasticsearch',
    // Cloud and DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible',
    // Data Science
    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'matplotlib', 'seaborn',
    'tableau', 'power bi', 'jupyter', 'r', 'spss', 'sas', 'hadoop', 'spark',
    // Tools
    'git', 'github', 'gitlab', 'jira', 'confluence', 'slack', 'figma', 'sketch', 'adobe',
    'photoshop', 'illustrator', 'canva'
  ];
  
  // Business skills patterns
  const businessSkills = [
    'project management', 'agile', 'scrum', 'kanban', 'leadership', 'team management',
    'strategic planning', 'business analysis', 'market research', 'digital marketing',
    'seo', 'sem', 'social media', 'content marketing', 'email marketing', 'ppc',
    'google analytics', 'facebook ads', 'hubspot', 'salesforce', 'mailchimp', 'hootsuite', 'crm'
  ];
  
  console.log('🔍 Searching for technical and business skills...');
  
  // Extract skills mentioned in the resume
  [...technicalSkills, ...businessSkills].forEach(skill => {
    if (text.includes(skill)) {
      // Capitalize properly
      const capitalizedSkill = skill.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      if (!skills.includes(capitalizedSkill)) {
        skills.push(capitalizedSkill);
        console.log(`✅ Found skill: ${capitalizedSkill}`);
      }
    }
  });
  
  console.log('🎯 Searching in skills section...');
  
  // Extract from skills section more specifically
  const lines = resumeText.split('\n');
  const skillsSectionStart = lines.findIndex(line => 
    /skills|technical|competencies|technologies/i.test(line)
  );
  
  if (skillsSectionStart !== -1) {
    console.log(`Found skills section at line ${skillsSectionStart}: "${lines[skillsSectionStart]}"`);
    // Look at next 10 lines after skills header
    for (let i = skillsSectionStart + 1; i < Math.min(skillsSectionStart + 11, lines.length); i++) {
      const line = lines[i];
      if (line && !line.match(/^[A-Z ]+$/)) { // Skip section headers
        console.log(`Processing line ${i}: "${line}"`);
        // Extract skills separated by |, •, or ,
        const lineSkills = line.split(/[|•,:()]/).map(s => s.trim()).filter(s => s.length > 1);
        lineSkills.forEach(skill => {
          const cleanSkill = skill.replace(/[^a-zA-Z0-9\s.+-]/g, '').trim();
          if (cleanSkill.length > 2 && cleanSkill.length < 30) {
            skills.push(cleanSkill);
            console.log(`📝 Extracted from skills section: ${cleanSkill}`);
          }
        });
      }
    }
  } else {
    console.log('❌ No skills section found');
  }
  
  // Add some common soft skills if mentioned
  const softSkills = ['communication', 'problem-solving', 'teamwork', 'leadership', 'creativity'];
  softSkills.forEach(skill => {
    if (text.includes(skill) || text.includes(skill.replace('-', ' '))) {
      const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
      skills.push(capitalizedSkill);
      console.log(`🤝 Found soft skill: ${capitalizedSkill}`);
    }
  });
  
  // Remove duplicates and return top skills
  const uniqueSkills = [...new Set(skills)];
  return uniqueSkills.slice(0, 15);
}

console.log('🧪 TESTING INTELLIGENT SKILLS EXTRACTION');
console.log('=' .repeat(60));
console.log('Resume preview:', testResume.substring(0, 200) + '...');
console.log('\nExtracting skills...\n');

const extractedSkills = extractSkillsFromText(testResume);

console.log('\n📊 RESULTS');
console.log('=' .repeat(60));
console.log(`Total skills found: ${extractedSkills.length}`);
console.log('Skills:', extractedSkills);

console.log('\n✅ Expected Marketing Skills:');
console.log('• Digital Marketing, SEO, Social Media, Google Analytics');
console.log('• HubSpot, Salesforce, Mailchimp, Hootsuite');
console.log('• Project Management, Leadership, Content Marketing');