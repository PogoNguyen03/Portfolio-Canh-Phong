// app/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import {
  Github, Mail, MapPin, ExternalLink, Code2,
  Layers, Sparkles, Terminal, Sun, Moon,
  Cpu, Monitor, Database, Globe
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- COMPONENTS ---

// 1. Skill Badge (Updated Style)
function SkillBadge({ item }: { item: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="px-3 py-1.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md 
                 text-slate-700 dark:text-slate-200 text-xs md:text-sm font-medium rounded-lg 
                 border border-slate-200 dark:border-slate-700 shadow-sm cursor-default 
                 flex items-center gap-2 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
      {item}
    </motion.div>
  );
}

// 2. Project Card (Updated: Limit Tech Stack & Glassmorphism)
function ProjectCard({ project, index }: { project: any, index: number }) {
  // Tách chuỗi stack thành mảng
  const stackList = project.stack.split(',').map((s: string) => s.trim());
  // Chỉ lấy tối đa 3 công nghệ để hiển thị tag
  const displayStack = stackList.slice(0, 3);
  const remaining = stackList.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative p-6 md:p-8 flex flex-col h-full z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-slate-700 transition-all duration-300">
            <Layers size={24} />
          </div>
          <div className="flex gap-2">
            {displayStack.map((tech: string, i: number) => (
               <span key={i} className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                 {tech}
               </span>
            ))}
            {remaining > 0 && (
               <span className="text-[10px] font-bold px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 rounded">
                 +{remaining}
               </span>
            )}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.name}
        </h3>

        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {project.overview}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                {project.solution ? "Solution Arch." : "Project"}
            </span>
            <div className="flex gap-3">
                 <motion.button whileHover={{ y: -2 }} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Github size={18} />
                 </motion.button>
                 <motion.button whileHover={{ y: -2 }} className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <ExternalLink size={18} />
                 </motion.button>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

// 3. Experience Timeline (Updated Dark Mode)
function ExperienceItem({ exp, index }: { exp: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8 md:pl-0"
    >
      <div className="md:grid md:grid-cols-12 md:gap-8 group">
        {/* Time Column */}
        <div className="hidden md:block md:col-span-3 text-right pt-2">
          <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 border border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-900 transition-colors">
            {exp.period}
          </span>
        </div>

        {/* Timeline Line */}
        <div className="absolute left-0 md:left-auto md:relative md:col-span-1 flex justify-center h-full">
          <div className="h-full w-[2px] bg-slate-200 dark:bg-slate-800 relative group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors">
            <div className="absolute top-2 -left-[5px] w-3 h-3 bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-full z-10 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"></div>
          </div>
        </div>

        {/* Content Column */}
        <div className="md:col-span-8 pb-12">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all relative z-10">
            <div className="md:hidden mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{exp.period}</span>
            </div>

            <h4 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {exp.role}
            </h4>
            <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">{exp.company}</p>

            <ul className="space-y-3">
              {exp.description.map((desc: string, i: number) => (
                <li key={i} className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                  {desc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- MAIN PAGE ---

export default function Portfolio() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- 1. Fetch Data ---
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/data', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load data');
        const fetchedData = await res.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- 2. Handle Dark Mode ---
  useEffect(() => {
    // Check localStorage or System Preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  // --- 3. Handle ScrollSpy (Active Navigation) ---
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'experience', 'projects'];
      
      // Tìm section đang chiếm phần lớn màn hình
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Logic: Nếu top của phần tử nằm trong khoảng 1/3 màn hình hoặc nó đang hiển thị rõ
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading || !data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const { personalInfo, skills, experiences, projects } = data;

  // Xử lý Role Split (Tách chức danh)
  // Ví dụ: "Full Stack | BA" -> ["Full Stack", "BA"]
  const roles = personalInfo.title.split('|').map((r: string) => r.trim()).slice(0, 3);

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-200 overflow-x-hidden relative transition-colors duration-500">

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 origin-left z-[70]"
        style={{ scaleX }}
      />

      {/* --- BACKGROUND EFFECTS (TECH/VIRTUAL) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
         {/* Grid Pattern di chuyển chậm */}
         <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] dark:opacity-[0.2]" />
         
         {/* Glow Orbs */}
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* --- FLOATING NAVBAR & THEME TOGGLE --- */}
      <div className="fixed top-6 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
            <motion.nav
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/50 rounded-full px-2 py-2 md:px-6 md:py-3 flex items-center gap-1"
            >
              <span className="font-bold text-slate-800 dark:text-white mr-4 hidden md:block">
                {personalInfo.name.split(' ').pop()}
              </span>
              {['About', 'Skills', 'Experience', 'Projects'].map((item) => {
                const id = item.toLowerCase();
                const isActive = activeSection === id;
                return (
                  <a
                    key={item}
                    href={`#${id}`}
                    onClick={() => setActiveSection(id)}
                    className={`
                        relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                        ${isActive 
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-bold' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }
                    `}
                  >
                    {item}
                    {isActive && (
                        <motion.span 
                            layoutId="activeNav" 
                            className="absolute inset-0 border-2 border-blue-100 dark:border-blue-500/30 rounded-full" 
                            transition={{type: "spring", stiffness: 300, damping: 30}}
                        />
                    )}
                  </a>
                );
              })}
            </motion.nav>

            {/* Dark Mode Toggle */}
            <motion.button
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                onClick={toggleTheme}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 rounded-full border border-white/20 dark:border-slate-700/50 shadow-lg hover:scale-110 transition-transform text-slate-700 dark:text-yellow-400"
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-24 pt-32 relative z-10">

        {/* --- HERO SECTION --- */}
        <section id="about" className="min-h-[85vh] flex flex-col justify-center mb-20 scroll-mt-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-xs font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Ready to Deploy
              </div>

              {/* Roles / Title Split */}
              <div className="flex flex-wrap gap-2 mb-4">
                  {roles.map((role: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono text-sm border border-slate-200 dark:border-slate-700">
                          {role}
                      </span>
                  ))}
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
                Hello, I'm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 animate-gradient bg-300%">
                  {personalInfo.name}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-lg">
                {personalInfo.summary}
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  href={`https://${personalInfo.github}`}
                  target="_blank"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-medium shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <Github size={20} /> Github
                </motion.a>
                {personalInfo.cvPath && (
                  <motion.a
                    href={personalInfo.cvPath}
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-8 py-4 rounded-full font-medium border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <Monitor size={20} /> Download CV
                  </motion.a>
                )}
              </div>

              <div className="mt-12 flex items-center gap-6 text-slate-500 dark:text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  <Mail size={16} /> {personalInfo.email}
                </div>
                <div className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  <MapPin size={16} /> {personalInfo.location}
                </div>
              </div>
            </motion.div>

            {/* Avatar Tech Style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 flex justify-center relative"
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Rotating Rings */}
                <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 border border-dashed border-purple-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative z-10 bg-slate-100">
                  {personalInfo.avatar ? (
                    <img
                      src={personalInfo.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-300">Me</div>
                  )}
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -right-4 top-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 z-20"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                    <Code2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Role</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Developer</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- SKILLS SECTION --- */}
        <section id="skills" className="mb-32 scroll-mt-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Tech Stack</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              My arsenal of tools for building scalable applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Terminal size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Backend & Core</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.languages.map((s: string) => <SkillBadge key={s} item={s} />)}
                  {skills.backend.map((s: string) => <SkillBadge key={s} item={s} />)}
                </div>
            </div>

            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                        <Monitor size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Frontend & UI</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map((s: string) => <SkillBadge key={s} item={s} />)}
                  {skills.mobileTools.map((s: string) => <SkillBadge key={s} item={s} />)}
                  {skills.designBA.map((s: string) => <SkillBadge key={s} item={s} />)}
                </div>
            </div>
          </div>
        </section>

        {/* --- EXPERIENCE SECTION --- */}
        <section id="experience" className="mb-32 scroll-mt-28">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Work History</h2>
              <p className="text-slate-500 dark:text-slate-400">My professional journey.</p>
            </div>
            <div className="hidden md:block w-32 h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          </div>

          <div className="space-y-0">
            {experiences.map((exp: any, index: number) => (
              <ExperienceItem key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </section>

        {/* --- PROJECTS SECTION --- */}
        <section id="projects" className="scroll-mt-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Featured Projects</h2>
            <p className="text-slate-500 dark:text-slate-400">Selected works demonstrating my capabilities.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">
            {projects.map((project: any, index: number) => (
              <div key={project.id} className={index === 0 || index === 3 ? "md:col-span-2" : ""}>
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <p className="mb-4">© 2025 {personalInfo.name}. Built with Next.js & Tailwind.</p>
          <div className="flex justify-center gap-6">
            <a href={`https://${personalInfo.github}`} className="hover:text-blue-500 transition-colors">Github</a>
            <a href={`mailto:${personalInfo.email}`} className="hover:text-blue-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}