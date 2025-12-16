// app/page.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import {
  Github, Mail, MapPin, ExternalLink, Code2,
  Server, Smartphone, PenTool, ArrowRight,
  Download, Layers, Sparkles, Terminal, Moon, Sun, Monitor
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- CONFIG ---
// Bạn có thể thêm thủ công tối đa 3 skill (hoặc hơn) tại đây nếu API thiếu
const MANUAL_SKILLS = [
  "Next.js 15", 
  "Tailwind v4", 
  "TypeScript"
]; 

// --- COMPONENTS CON ---

function SkillBadge({ item }: { item: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className="px-4 py-2 bg-[var(--card-bg)] backdrop-blur-sm text-[var(--foreground)] text-sm font-medium rounded-xl border border-[var(--border-color)] shadow-sm transition-colors cursor-default select-none"
    >
      {item}
    </motion.span>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-full bg-[var(--card-bg)] backdrop-blur-md rounded-3xl border border-[var(--border-color)] overflow-hidden hover:border-[var(--accent)] transition-all hover:shadow-xl dark:hover:shadow-blue-900/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-8 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-blue-100/10 dark:bg-blue-900/30 rounded-2xl text-[var(--accent)] group-hover:scale-110 transition-transform duration-300">
            <Layers size={24} />
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full uppercase tracking-wider">
            {project.stack.split(',')[0]}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--accent)] transition-colors">
          {project.name}
        </h3>

        <p className="text-[var(--text-muted)] mb-6 line-clamp-3 flex-grow">
          {project.overview}
        </p>

        <div className="mt-auto pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)]">Solution Oriented</span>
          <motion.button
            whileHover={{ x: 5 }}
            className="text-sm font-semibold text-[var(--accent)] flex items-center gap-1"
          >
            Details <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ExperienceItem({ exp, index }: { exp: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8 md:pl-0"
    >
      <div className="md:grid md:grid-cols-12 md:gap-8">
        {/* Cột thời gian */}
        <div className="hidden md:block md:col-span-3 text-right pt-2">
          <span className="inline-block px-3 py-1 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300">
            {exp.period}
          </span>
        </div>

        {/* Cột mốc timeline */}
        <div className="absolute left-0 md:left-auto md:relative md:col-span-1 flex justify-center h-full">
          <div className="h-full w-[2px] bg-slate-200 dark:bg-slate-700 relative">
            <div className="absolute top-2 -left-[5px] w-3 h-3 bg-[var(--background)] border-2 border-[var(--accent)] rounded-full z-10 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"></div>
          </div>
        </div>

        {/* Cột nội dung */}
        <div className="md:col-span-8 pb-12">
          <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all relative">
            <div className="md:hidden mb-2">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">{exp.period}</span>
            </div>

            <h4 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
              {exp.role}
            </h4>
            <p className="text-[var(--accent)] font-medium mb-4">{exp.company}</p>

            <ul className="space-y-3">
              {exp.description.map((desc: string, i: number) => (
                <li key={i} className="text-[var(--text-muted)] text-sm leading-relaxed flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-[var(--accent)] rounded-full flex-shrink-0" />
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
  const [activeSection, setActiveSection] = useState('about');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Fetch Data
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

  // Xử lý Dark Mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Xử lý Active Navigation (Scroll Spy)
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'experience', 'projects'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Nếu phần tử nằm trong vùng nhìn thấy (viewport) khoảng 1/3
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Xử lý cuộn mượt khi click nav
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const { personalInfo, skills, experiences, projects } = data;

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative transition-colors duration-300">

      {/* 1. Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* 2. Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* 3. Floating Navbar & Theme Toggle */}
      <div className="fixed top-6 left-0 right-0 flex justify-center z-50 px-4 items-center gap-4">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[var(--background)]/80 backdrop-blur-xl border border-[var(--border-color)] shadow-lg shadow-black/5 rounded-full px-2 py-2 flex items-center gap-1"
        >
          {['About', 'Skills', 'Experience', 'Projects'].map((item) => {
            const id = item.toLowerCase();
            const isActive = activeSection === id;
            return (
              <a
                key={item}
                href={`#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                className={`
                  relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive 
                    ? 'text-[var(--accent)] bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800'}
                `}
              >
                {/* Chỉ báo active (dấu chấm nhỏ) */}
                {isActive && (
                  <motion.span 
                    layoutId="nav-active"
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)]"
                  />
                )}
                {item}
              </a>
            );
          })}
        </motion.nav>

        {/* Nút chuyển đổi giao diện */}
        <motion.button
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={toggleTheme}
          className="bg-[var(--background)]/80 backdrop-blur-xl border border-[var(--border-color)] p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform text-[var(--foreground)]"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-24 pt-32">

        {/* --- HERO SECTION --- */}
        <section id="about" className="min-h-[85vh] flex flex-col justify-center mb-20 relative scroll-mt-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-[var(--accent)] text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Available for work
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--foreground)] tracking-tight leading-[1.1] mb-6">
                Building <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient bg-300%">
                  Digital Products
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--text-muted)] leading-relaxed mb-8 max-w-lg">
                {personalInfo.summary}
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  href={`https://${personalInfo.github}`}
                  target="_blank"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Github size={20} /> Github
                </motion.a>
                {personalInfo.cvPath && (
                  <motion.a
                    href={personalInfo.cvPath}
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[var(--card-bg)] text-[var(--foreground)] px-8 py-4 rounded-full font-medium border border-[var(--border-color)] shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <Download size={20} /> CV
                  </motion.a>
                )}
              </div>

              <div className="mt-12 flex items-center gap-6 text-[var(--text-muted)] text-sm font-medium">
                <div className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors cursor-pointer">
                  <Mail size={16} /> {personalInfo.email}
                </div>
                <div className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors cursor-pointer">
                  <MapPin size={16} /> {personalInfo.location}
                </div>
              </div>
            </motion.div>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 flex justify-center relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 to-purple-200/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full p-2 border-2 border-dashed border-[var(--border-color)]">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--background)] shadow-2xl relative">
                   {personalInfo.avatar ? (
                      <img src={personalInfo.avatar} alt="Me" className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">Me</div>
                   )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- SKILLS SECTION --- */}
        <section id="skills" className="mb-32 scroll-mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">Technical Proficiency</h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              A comprehensive look at the libraries, languages, and tools I use.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--border-color)]">
                <h3 className="flex items-center gap-2 font-bold text-[var(--foreground)] mb-4">
                  <Terminal className="text-[var(--accent)]" size={20} /> Languages & Backend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {/* Kết hợp Skill từ DB và Skill thêm thủ công */}
                  {[...skills.languages, ...skills.backend, ...MANUAL_SKILLS].map((s: string, i) => (
                     <SkillBadge key={`${s}-${i}`} item={s} />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--border-color)] h-full">
              <h3 className="flex items-center gap-2 font-bold text-[var(--foreground)] mb-6">
                <Smartphone className="text-purple-500" size={20} /> Frontend & Others
              </h3>
              <div className="flex flex-wrap gap-3">
                {[...skills.frontend, ...skills.designBA].map((s: string, i) => <SkillBadge key={i} item={s} />)}
              </div>
            </div>
          </div>
        </section>

        {/* --- EXPERIENCE SECTION (Giữ nguyên) --- */}
        <section id="experience" className="mb-32 scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2">Work Experience</h2>
              <p className="text-[var(--text-muted)]">My professional track record.</p>
            </div>
            <div className="hidden md:block w-32 h-1 bg-[var(--border-color)] rounded-full"></div>
          </div>

          <div className="space-y-0">
            {experiences.map((exp: any, index: number) => (
              <ExperienceItem key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </section>

        {/* --- PROJECTS SECTION --- */}
        <section id="projects" className="scroll-mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">Featured Projects</h2>
            <p className="text-[var(--text-muted)]">Some things I've built.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
            {projects.map((project: any, index: number) => (
              <div key={project.id} className={index === 0 || index === 3 ? "md:col-span-2" : ""}>
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-[var(--text-muted)] bg-slate-50 dark:bg-slate-900 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 {personalInfo.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href={`https://${personalInfo.github}`} className="hover:text-[var(--accent)] transition-colors">Github</a>
            <a href={`mailto:${personalInfo.email}`} className="hover:text-[var(--accent)] transition-colors">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}