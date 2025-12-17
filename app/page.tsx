// app/page.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import {
  Github, Mail, MapPin, ExternalLink, Code2,
  Layers, Terminal, Sun, Moon, Monitor,
  GitCommit, Calendar, ArrowUp, Check, Copy, X
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { submitContactForm } from '@/lib/adminActions';
import { Send, User, AtSign, MessageSquare, Paperclip } from 'lucide-react';
import { trackVisit } from '@/lib/analyticsActions';

// --- COMPONENTS ---

// 1. Terminal Intro (Có nút Skip)
function TerminalIntro({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const bootSequence = [
    "> Initializing kernel...",
    "> Loading system modules...",
    "> Verifying user credentials...",
    "> User: Nguyen Canh Phong detected.",
    "> Role: Full Stack Developer | BA",
    "> Access Granted.",
    "> Starting Portfolio v2.0..."
  ];

  useEffect(() => {
    let delay = 0;
    const timeouts: NodeJS.Timeout[] = [];

    bootSequence.forEach((line, index) => {
      delay += Math.random() * 300 + 100;
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (index === bootSequence.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0b1121] text-green-500 font-mono p-8 flex flex-col justify-end pb-20 md:justify-center md:pb-0"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute top-8 right-8 text-slate-500 hover:text-white text-xs border border-slate-700 px-3 py-1 rounded hover:border-slate-500 transition-colors"
      >
        [ESC] SKIP
      </button>

      <div className="max-w-2xl mx-auto w-full">
        {lines.map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {line}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-3 h-5 bg-green-500 ml-1 align-middle"
        />
      </div>
    </motion.div>
  );
}

// 2. Scroll To Top Button
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// 3. Typewriter
const Typewriter = ({ texts, speed = 150, delay = 2000 }: { texts: string[], speed?: number, delay?: number }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleType = () => {
      const fullText = texts[currentTextIndex];
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    };
    const timer = setTimeout(handleType, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, delay]);

  return (
    <span className="inline-block min-w-[200px] text-left">
      {currentText}
      <span className="animate-pulse text-blue-500">|</span>
    </span>
  );
};

// 4. Skill Badge
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

// 5. Project Card (Spotlight Effect)
function ProjectCard({ project, index }: { project: any, index: number }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const stackList = project.stack.split(',').map((s: string) => s.trim());
  const displayStack = stackList.slice(0, 3);
  const remaining = stackList.length - 3;

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-500/10"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.1), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 rounded-2xl"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.4), transparent 40%)`,
          maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px'
        }}
      />
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

// 6. Experience Timeline
function ExperienceItem({ exp, index }: { exp: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8 md:pl-0"
    >
      <div className="md:grid md:grid-cols-12 md:gap-8 group">
        <div className="hidden md:block md:col-span-3 text-right pt-2">
          <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 border border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-900 transition-colors">
            {exp.period}
          </span>
        </div>
        <div className="absolute left-0 md:left-auto md:relative md:col-span-1 flex justify-center h-full">
          <div className="h-full w-[2px] bg-slate-200 dark:bg-slate-800 relative group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors">
            <div className="absolute top-2 -left-[5px] w-3 h-3 bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-full z-10 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"></div>
          </div>
        </div>
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

// COMPONENT CONTACT FORM (MỚI)
function ContactSection() {
  const [status, setStatus] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const res = await submitContactForm(formData);
    setStatus(res);
    setIsPending(false);
    if (res.success && formRef.current) {
      formRef.current.reset();
      // Tự động tắt thông báo sau 3s
      setTimeout(() => setStatus(null), 5000);
    }
  }

  return (
    <section id="contact" className="mb-32 scroll-mt-28">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Get In Touch</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Interested in working together? Drop me a message!
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <form ref={formRef} action={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <User size={16} /> Name
                </label>
                <input
                  type="text" name="name" required placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <AtSign size={16} /> Email
                </label>
                <input
                  type="email" name="email" required placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MessageSquare size={16} /> Message
              </label>
              <textarea
                name="message" required rows={4} placeholder="Let's build something amazing..."
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Paperclip size={16} /> Attachments (Max 3 files)
              </label>
              <input
                type="file"
                name="files"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-blue-400
                      cursor-pointer"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isPending}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isPending ? "Sending..." : <>Send Message <Send size={20} /></>}
            </motion.button>

            {/* Notification Message */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl text-center text-sm font-medium ${status.success ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`}
                >
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
}
// --- MAIN PAGE ---

export default function Portfolio() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [githubUsername, setGithubUsername] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Copy Email State
  const [copied, setCopied] = useState(false);
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    setSelectedYear(new Date().getFullYear());
    async function fetchData() {
      try {
        const res = await fetch('/api/data', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load data');
        const fetchedData = await res.json();
        setData(fetchedData);
        const username = fetchedData.personalInfo.github.split('/').pop() || '';
        setGithubUsername(username);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    trackVisit();
  }, []);

  useEffect(() => {
    if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      setDarkMode(false);
      document.documentElement.classList.add('light');
    } else {
      setDarkMode(true);
      document.documentElement.classList.remove('light');
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading || !data || selectedYear === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const { personalInfo, skills, experiences, projects } = data;
  const roles = personalInfo.title.split('|').map((r: string) => r.trim());
  const currentYear = new Date().getFullYear();

  return (
    <>
      <AnimatePresence>
        {showIntro && <TerminalIntro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <div className="min-h-screen font-sans selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-200 overflow-x-hidden relative transition-colors duration-500">

          <ScrollToTop />

          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 origin-left z-[70]"
            style={{ scaleX }}
          />

          {/* --- NEW: Moving Gradient Orbs Background --- */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] dark:opacity-[0.2]" />

            {/* Blue Orb - Moves around */}
            <motion.div
              animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px]"
            />

            {/* Purple Orb - Moves opposite */}
            <motion.div
              animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
              transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[120px]"
            />
          </div>

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
                {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((item) => {
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
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </a>
                  );
                })}
              </motion.nav>

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
            {/* HERO SECTION */}
            <section id="about" className="min-h-[85vh] flex flex-col justify-center mb-20 scroll-mt-32">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="order-2 lg:order-1"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-xs font-semibold mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Available for work
                  </div>
                  <div className="mb-4 text-xl md:text-2xl font-mono text-slate-500 dark:text-slate-400 flex gap-2">
                    <span>I am a</span>
                    <span className="font-bold text-slate-800 dark:text-blue-400">
                      <Typewriter texts={roles} />
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
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
                    <div
                      className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
                      onClick={() => handleCopyEmail(personalInfo.email)}
                    >
                      <Mail size={16} />
                      <span className="relative">
                        {personalInfo.email}
                        <span className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </span>
                      </span>
                      {copied && <span className="text-xs text-green-500 ml-2 animate-bounce">Copied!</span>}
                    </div>
                    <div className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                      <MapPin size={16} /> {personalInfo.location}
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="order-1 lg:order-2 flex justify-center relative"
                >
                  <div className="relative w-72 h-72 md:w-96 md:h-96">
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

            {/* SKILLS SECTION */}
            <section id="skills" className="mb-32 scroll-mt-28">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Tech Stack</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                  My arsenal of tools for building scalable applications.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
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

              {/* FIXED: GitHub Activity Graph (Deno API) */}
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                      <GitCommit size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Coding Activity</h3>
                  </div>
                </div>

                {githubUsername ? (
                  <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                    {/* Ảnh biểu đồ thay đổi theo năm (Lưu ý: ghchart API có thể mặc định là năm hiện tại nếu tham số 'y' không được hỗ trợ đầy đủ, nhưng logic code đã sẵn sàng) */}
                    <img
                      src={`https://ghchart.rshah.org/3b82f6/${githubUsername}?y=${selectedYear}`}
                      alt={`GitHub Contributions ${selectedYear}`}
                      className="w-full min-w-[600px] dark:opacity-80 dark:invert-[0.1]"
                    />
                    <p className="text-xs text-slate-400 mt-4 text-center">
                      Contributions in {selectedYear} • <a href={`https://github.com/${githubUsername}`} target="_blank" className="underline hover:text-blue-500">View Profile</a>
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500">Github username not found.</p>
                )}
              </div>
            </section>

            {/* EXPERIENCE SECTION */}
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

            {/* PROJECTS SECTION */}
            <section id="projects" className="mb-32 scroll-mt-28">
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
            <ContactSection />

          </main>

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
      )}
    </>
  );
}