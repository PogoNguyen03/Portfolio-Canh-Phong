"use client"; // Bắt buộc thêm dòng này để dùng animation

import React from 'react';
import { Github, Mail, MapPin, Phone, ExternalLink, Code2, Server, Database, Smartphone, PenTool, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Portfolio() {
  const personalInfo = {
    name: "NGUYEN CANH PHONG",
    title: "Full Stack Developer | Business Analyst",
    location: "Dist 7, HCMC",
    phone: "+84 774.651.178",
    email: "nguyencanhphong246@gmail.com",
    github: "github.com/pogonguyen03",
    summary: "Results-oriented Full Stack Developer with 1+ year experience. Proven track record in building scalable web apps and optimizing high-traffic systems. Strong BA foundation, skilled in translating requirements into specs.",
  };

  const skills = {
    languages: ["Java", "C#", "PHP", "Python", "JavaScript", "Dart"],
    frontend: ["ReactJS", "Next.js", "Tailwind", "Bootstrap", "HTML5/CSS3"],
    backend: ["Node.js", ".NET", "SQL Server", "MySQL", "Oracle", "MongoDB", "Firebase"],
    mobileTools: ["Android", "Flutter", "Git", "Postman", "Selenium", "WordPress"],
    designBA: ["StarUML", "Balsamiq", "Figma", "Photoshop", "Illustrator"]
  };

  const experiences = [
    {
      company: "THIEN CO TRI LIEN CO., LTD",
      role: "Full Stack Developer",
      period: "Dec 2024 - Present",
      description: [
        "High-Volume System: Managed 1,000+ domains (PHP/Python/CMS).",
        "Automation: Developed scripts slashing manual entry time by 40%.",
        "Web Dev: Customized WordPress themes for high-traffic niches.",
        "Server Admin: Maintained 99.9% uptime with proactive monitoring."
      ]
    },
    {
      company: "BIT GROUP INVESTMENT JSC",
      role: "Web Developer Intern",
      period: "Aug 2024 - Nov 2024",
      description: [
        "Built and deployed corporate websites using WordPress and PHP.",
        "BA Role: Bridged gap between clients and developers, ensuring 100% on-time delivery."
      ]
    },
    {
      company: "TRUONG THINH TECHNOLOGY",
      role: "Hardware Technician Intern",
      period: "Apr 2024 - May 2024",
      description: [
        "Diagnosed hardware issues; assembled/configured PC systems."
      ]
    }
  ];

  const projects = [
    {
      name: "Digital Wedding Invitation Platform",
      stack: "Next.js, Prisma, SQL",
      overview: "Architected a scalable platform allowing users to generate personalized QR codes for event check-ins.",
      solution: "Engineered a secure Middleware layer to filter malicious traffic and enforce IP-based authentication."
    },
    {
      name: "2D RPG Game Engine",
      stack: "Core Java, NetBeans",
      overview: "Developed a Java-based game engine from scratch, applying advanced OOP principles.",
      solution: "Optimized collision detection algorithms to handle multi-object interactions smoothly."
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
            {personalInfo.name}
          </h1>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            {['About', 'Skills', 'Experience', 'Projects'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-600 transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>
        </div>
      </motion.header>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-24">
        
        {/* Intro Section */}
        <motion.section 
          id="about" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8 items-center"
        >
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Welcome to my portfolio</span>
              <h2 className="text-5xl font-extrabold text-slate-900 leading-tight">
                Hi, I'm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500">
                  Canh Phong
                </span>
              </h2>
            </div>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              {personalInfo.summary}
            </p>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-700">
              {[
                { icon: MapPin, text: personalInfo.location },
                { icon: Phone, text: personalInfo.phone },
                { icon: Mail, text: personalInfo.email }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
                  <item.icon size={14} className="text-blue-600"/> {item.text}
                </div>
              ))}
            </div>

            <div className="pt-4 flex gap-3">
               <motion.a 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 href={`https://${personalInfo.github}`} 
                 target="_blank" 
                 className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition shadow-lg hover:shadow-xl"
               >
                 <Github size={20} /> GitHub Profile
               </motion.a>
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="inline-flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-full hover:bg-slate-50 transition shadow-sm"
               >
                 Download CV <ArrowRight size={16} />
               </motion.button>
            </div>
          </motion.div>

          {/* Profile Card - Đã sửa nội dung theo yêu cầu */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="md:col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
             
             <div className="relative z-10 text-center">
                <div className="w-28 h-28 bg-white p-1 rounded-full mx-auto mb-6 shadow-lg">
                    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        {/* Thay bằng ảnh thật của bạn sau này */}
                        <span className="text-3xl font-bold text-blue-900">CP</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Nguyen Canh Phong</h3>
                <div className="text-blue-100 text-xs font-mono bg-blue-900/30 inline-block px-3 py-1 rounded-full mb-4">
                    Full Stack • BA • Tester
                </div>
                
                <div className="space-y-3 text-sm text-blue-50 text-left bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                   <div className="flex justify-between border-b border-white/10 pb-2">
                      <span>GPA</span>
                      <span className="font-bold text-white">3.27 / 4.0</span>
                   </div>
                   <div className="flex justify-between">
                      <span>English</span>
                      <span className="font-bold text-white">TOEIC 570</span>
                   </div>
                </div>
             </div>
          </motion.div>
        </motion.section>

        {/* Skills Section */}
        <section id="skills">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-8"
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Code2 className="text-blue-600"/> Technical Arsenal
            </h3>
            <p className="text-slate-500">Languages & technologies I use to build products</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkillCard title="Languages" icon={<Code2 size={20}/>} items={skills.languages} delay={0.1} />
            <SkillCard title="Front-End" icon={<Smartphone size={20}/>} items={skills.frontend} delay={0.2} />
            <SkillCard title="Back-End & DB" icon={<Database size={20}/>} items={skills.backend} delay={0.3} />
            <SkillCard title="Tools & Mobile" icon={<Server size={20}/>} items={skills.mobileTools} delay={0.4} />
            <SkillCard title="BA & Design" icon={<PenTool size={20}/>} items={skills.designBA} delay={0.5} />
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="mb-10"
          >
             <h3 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
               <ExternalLink className="text-blue-600"/> Professional Journey
             </h3>
          </motion.div>

          <div className="border-l-2 border-slate-200 ml-3 space-y-12">
            {experiences.map((exp, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-8 group"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-4 border-slate-300 rounded-full group-hover:border-blue-500 transition-colors"></div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-800">{exp.role}</h4>
                        <span className="font-semibold text-blue-600">{exp.company}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="text-slate-600 flex gap-2 text-sm leading-relaxed">
                          <span className="text-blue-400 mt-1.5">•</span>
                          {desc}
                        </li>
                      ))}
                    </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-8"
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Github className="text-blue-600"/> Featured Projects
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 group"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {project.name}
                        </h4>
                        <Database size={20} className="text-slate-300"/>
                    </div>
                    <div className="mb-6">
                        <span className="text-xs font-semibold tracking-wide text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {project.stack}
                        </span>
                    </div>
                    <div className="space-y-4 text-sm text-slate-600">
                      <div>
                          <strong className="text-slate-900 block mb-1">Overview</strong>
                          {project.overview}
                      </div>
                      <div>
                          <strong className="text-slate-900 block mb-1">Solution</strong>
                          {project.solution}
                      </div>
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center mt-24 border-t border-slate-800">
        <p className="mb-2">© 2025 Nguyen Canh Phong</p>
        <p className="text-sm">Designed & Built with Next.js, Tailwind & Framer Motion</p>
      </footer>
    </div>
  );
}

// Helper Component for Skills with Animation
function SkillCard({ title, items, icon, delay }: { title: string, items: string[], icon: any, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-4 text-blue-700 font-bold">
        <div className="p-2 bg-blue-50 rounded-lg">
            {icon}
        </div>
        <h4>{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((skill) => (
          <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-md border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-default">
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}