"use client";
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image'; // <--- QUAN TRỌNG: Dùng cái này để ảnh load nhanh
import Link from 'next/link';
import {
  Github, Mail, MapPin, ExternalLink, Code2,
  Layers, Terminal, Sun, Moon, Monitor,
  GitCommit, ArrowUp, Check, Copy, X,
  Send, User, AtSign, MessageSquare, Paperclip,
  GraduationCap, Award, Globe, Lock, Phone, Menu, Calendar,
  Database, Wrench, Users, UserCircle
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence, useMotionValue, useTransform, animate, MotionValue } from 'framer-motion';
import { submitContactForm } from '@/lib/adminActions';
import Spline from '@splinetool/react-spline';
import { toast } from 'sonner';


// --- COMPONENTS CON (Đã tối ưu) ---

// 1. Custom Cursor (Bản tối ưu hiệu năng - Không gây lag)
function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Tăng damping để mượt hơn, giảm stiffness để bớt nặng CPU
  const springConfig = { damping: 40, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Chỉ kích hoạt trên thiết bị có chuột
    if (window.matchMedia("(pointer: fine)").matches) {
      document.body.classList.add('custom-cursor-active');
    }

    const moveCursor = (e: MouseEvent) => {
      // Dùng requestAnimationFrame để đồng bộ với tần số quét màn hình
      window.requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      });
    };

    // Sử dụng event delegation để kiểm tra hover (Hiệu năng tốt hơn)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = !!target.closest('a, button, input, [role="button"]');
      setIsHovering(isClickable);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Vòng ngoài - Sử dụng spring cho độ trễ mượt mà */}
      <motion.div
        className="fixed top-0 left-0 border border-blue-400 mix-blend-difference will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 60 : 32,
          height: isHovering ? 60 : 32,
          rotate: isHovering ? 90 : 0,
        }}
      >
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-400" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-400" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-400" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-400" />
      </motion.div>

      {/* Tâm điểm - Đi theo chuột chính xác 1:1 */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-1 h-4 bg-blue-500 absolute" />
        <div className="w-4 h-1 bg-blue-500 absolute" />
      </motion.div>
    </div>
  );
}

// 2. Terminal Intro (Giữ nguyên)
function TerminalIntro({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const bootSequence = ["> Initializing kernel...", "> Loading system modules...", "> Verifying user credentials...", "> User: Nguyen Canh Phong detected.", "> Role: Full Stack Developer | BA", "> Access Granted.", "> Starting Portfolio v2.0..."];
  useEffect(() => {
    let delay = 0;
    const timeouts: NodeJS.Timeout[] = [];
    bootSequence.forEach((line, index) => {
      delay += Math.random() * 300 + 100;
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (index === bootSequence.length - 1) setTimeout(onComplete, 800);
      }, delay);
      timeouts.push(timeout);
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);
  return (
    <motion.div className="fixed inset-0 z-[100] bg-[#0b1121] text-green-500 font-mono p-8 flex flex-col justify-end pb-20 md:justify-center md:pb-0" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }}>
      <button onClick={onComplete} className="absolute top-8 right-8 text-slate-500 hover:text-white text-xs border border-slate-700 px-3 py-1 rounded hover:border-slate-500 transition-colors">[ESC] SKIP</button>
      <div className="max-w-2xl mx-auto w-full">{lines.map((line, i) => (<motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>{line}</motion.div>))}
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-3 h-5 bg-green-500 ml-1 align-middle" />
      </div>
    </motion.div>
  );
}

// 3. Typewriter (Bản Smooth Motion)
const Typewriter = ({ texts, delay = 2000 }: { texts: string[], delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[index];
    const count = new MotionValue(0);
    const duration = Math.min(currentText.length * 0.1, 2);
    const controls = animate(count, currentText.length, {
      type: "tween", duration: duration, ease: "linear",
      onUpdate: (latest) => setDisplayedText(currentText.slice(0, Math.round(latest))),
      onComplete: () => {
        setTimeout(() => {
          animate(count, 0, {
            type: "tween", duration: duration * 0.8, ease: "easeInOut",
            onUpdate: (latest) => setDisplayedText(currentText.slice(0, Math.round(latest))),
            onComplete: () => setIndex((prev) => (prev + 1) % texts.length)
          });
        }, delay);
      }
    });
    return () => controls.stop();
  }, [index, texts, delay]);

  return (
    // Thêm h-[1.2em] để giữ chiều cao và whitespace-nowrap để không bị nhảy dòng
    <span className="inline-block relative h-[1.2em] leading-none align-baseline">
      <span className="invisible">M</span> {/* Kỹ thuật giữ chiều cao dòng tối thiểu */}
      <span className="absolute left-0 top-0 whitespace-nowrap">
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="inline-block w-[2px] h-[1em] bg-blue-500 ml-1 align-middle"
        />
      </span>
    </span>
  );
};

// 4. Các Components nhỏ khác (SkillBadge, ExperienceItem, ScrollToTop, TiltCard, ContactSection...)
// (Giữ nguyên code của bạn cho các phần này để tiết kiệm diện tích, chỉ thay đổi ProjectCard bên dưới)

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => window.scrollY > 500 ? setIsVisible(true) : setIsVisible(false);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 30 }}
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(59, 130, 246, 0.2)", // Sáng lên nhẹ khi hover
            y: -5
          }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          // HIỆU ỨNG FROSTED GLASS (KÍNH MỜ) THUẦN KHIẾT
          className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 p-3 
                     bg-white/10 dark:bg-slate-800/20 
                     backdrop-blur-xl border border-white/20 dark:border-slate-700/50
                     text-blue-600 dark:text-blue-400 rounded-full 
                     shadow-2xl shadow-black/10
                     transition-colors duration-300
                     flex items-center justify-center"
        >
          <ArrowUp size={24} className="drop-shadow-sm" />

          {/* Lớp phủ bóng nhẹ tạo hiệu ứng khối thủy tinh */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function SkillBadge({ item }: { item: string }) {
  return (<motion.div whileHover={{ scale: 1.05, y: -2 }} className="px-3 py-1.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-700 dark:text-slate-200 text-xs md:text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-default flex items-center gap-2 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>{item}</motion.div>);
}

function ExperienceItem({ exp, index }: { exp: any, index: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: index * 0.1 }} className="relative pl-8 md:pl-0">
      <div className="md:grid md:grid-cols-12 md:gap-8 group">
        <div className="hidden md:block md:col-span-3 text-right pt-2"><span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 border border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-900 transition-colors">{exp.period}</span></div>
        <div className="absolute left-0 md:left-auto md:relative md:col-span-1 flex justify-center h-full"><div className="h-full w-[2px] bg-slate-200 dark:bg-slate-800 relative group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors"><div className="absolute top-2 -left-[5px] w-3 h-3 bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-full z-10 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"></div></div></div>
        <div className="md:col-span-8 pb-12">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all relative z-10">
            <div className="md:hidden mb-2"><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{exp.period}</span></div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">{exp.role}</h4>
            <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">{exp.company}</p>
            <ul className="space-y-3">{exp.description.map((desc: string, i: number) => (<li key={i} className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex items-start gap-3"><span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />{desc}</li>))}</ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0); const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 10 }); const mouseY = useSpring(y, { stiffness: 150, damping: 10 });
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5); y.set((clientY - top) / height - 0.5);
  }
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]); const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  return (<motion.div onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative w-full h-full perspective-1000"><div style={{ transform: "translateZ(20px)" }} className="h-full">{children}</div></motion.div>);
}

// 5. Project Card (Đã tối ưu dùng next/image)
function ProjectCard({ project, index }: { project: any, index: number }) {
  const stackList = project.stack.split(',').map((s: string) => s.trim());
  const projectIndex = String(index + 1).padStart(2, '0');
  const coverImage = project.images && project.images.length > 0 ? project.images[0] : null;
  const isEven = index % 2 === 0;
  const isPrivate = project.visibility === 'Private';
  const handleViewDetail = () => { sessionStorage.setItem("projectScrollPos", window.scrollY.toString()); };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }} className={`group relative flex flex-col-reverse gap-6 md:gap-8 md:items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Content */}
      <div className="flex-1 relative z-10">
        <div className={`flex items-center gap-3 mb-3 md:mb-4 ${isEven ? 'justify-start' : 'md:justify-end justify-start'}`}><span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">Featured Project</span><span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${isPrivate ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'}`}>{isPrivate ? <Lock size={10} /> : <Globe size={10} />}{project.visibility || 'Public'}</span></div>
        <h3 className={`text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 md:mb-6 ${isEven ? 'text-left' : 'md:text-right text-left'}`}><Link href={`/project/${project.id}`} onClick={handleViewDetail} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{project.name}</Link></h3>
        <div className={`flex flex-wrap gap-4 mb-4 text-sm font-medium ${isEven ? 'justify-start' : 'md:justify-end justify-start'}`}>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <UserCircle size={16} className="text-blue-500" />
            <span>{project.role}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Users size={16} className="text-purple-500" />
            <span>{project.teamSize || 'Solo'}</span>
          </div>
        </div>
        <div className={`relative transition-transform hover:-translate-y-1 duration-300 md:p-8 md:bg-white md:dark:bg-slate-900/90 md:rounded-2xl md:shadow-xl md:border md:border-slate-100 md:dark:border-slate-800 md:backdrop-blur-sm ${isEven ? 'md:mr-0 md:-mr-16' : 'md:ml-0 md:-ml-16'}`}><p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{project.overview}</p></div>
        <div className={`flex flex-wrap gap-2 mt-4 md:mt-6 ${isEven ? 'justify-start' : 'md:justify-end justify-start'}`}>{stackList.map((tech: string, i: number) => (<span key={i} className="text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-mono">{tech}</span>))}</div>
        <div className={`mt-6 md:mt-8 flex items-center gap-4 ${isEven ? 'justify-start' : 'md:justify-end justify-start'}`}>
          {/* Thay thế nút View Case Study bằng logic Demo Link */}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Live Demo <ExternalLink className="transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" size={18} />
            </a>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-sm cursor-help" title="Dự án này hiện chưa có link demo công khai">
              Not Deployed Yet <X size={16} />
            </div>
          )}

          {/* Các nút icon Github và Demo nhỏ bên cạnh (nếu bạn vẫn muốn giữ) */}
          {!isPrivate && project.github && (
            <a href={project.github} target="_blank" className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" title="GitHub">
              <Github size={20} />
            </a>
          )}


          <div className={`hidden md:block absolute -bottom-10 -z-10 text-[180px] font-black text-slate-100 dark:text-slate-800/30 leading-none select-none pointer-events-none transition-all duration-500 ${isEven ? '-right-10' : '-left-10'}`}>
            {projectIndex}
          </div>
        </div>
      </div>
      {/* Image with next/image */}
      <div className="flex-[1.2] relative group/img w-full">
        <div className="md:hidden absolute top-3 right-3 z-20 text-5xl font-black text-white/50 drop-shadow-md select-none pointer-events-none mix-blend-overlay">{projectIndex}</div>
        <TiltCard>
          <Link href={`/project/${project.id}`} onClick={handleViewDetail} className="block relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-video bg-slate-100 dark:bg-slate-900">
            {coverImage ? (
              <div className="relative w-full h-full">
                {/* Dùng Image của Next.js để tối ưu load ảnh */}
                <Image
                  src={coverImage}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-blue-900/20 dark:bg-slate-900/30 group-hover/img:bg-transparent transition-colors duration-500 flex items-center justify-center">
                  {isPrivate && (<div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity"><Lock size={16} /> Private Access</div>)}
                </div>
              </div>
            ) : (<div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700"><Layers size={64} className="mb-4" /><span className="text-sm font-mono">No Cover Image</span></div>)}
          </Link>
        </TiltCard>
      </div>
    </motion.div>
  );
}

// ... ContactSection bạn giữ nguyên code cũ ...
function ContactSection({ personalInfo }: { personalInfo: any }) {
  const [status, setStatus] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCopy = async (text: string, label: string) => {
    // 1. Kiểm tra xem API có tồn tại và đang ở môi trường bảo mật không
    if (typeof window !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success(`Copied ${label} to clipboard!`);
      } catch (err) {
        toast.error("Failed to copy!");
      }
    } else {
      // 2. Phương án dự phòng (Fallback) nếu Clipboard API không khả dụng
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Đảm bảo không làm nhảy giao diện
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          toast.success(`Copied ${label} to clipboard!`);
        } else {
          throw new Error('Copy command failed');
        }
      } catch (err) {
        toast.error("Browser doesn't support copying!");
        console.error("Copy error:", err);
      }
    }
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const res = await submitContactForm(formData);
    setStatus(res);
    setIsPending(false);
    if (res.success && formRef.current) {
      formRef.current.reset();
      setTimeout(() => setStatus(null), 5000);
    }
  }

  return (
    <section id="contact" className="mb-32 scroll-mt-28">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Get In Touch</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Interested in working together? Drop me a message or contact me directly!
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Contact Information</h3>
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl"><User size={24} /></div>
                <div><p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</p><p className="text-xl font-bold text-slate-900 dark:text-white">{personalInfo.name}</p></div>
              </div>
              <div
                className="flex items-center gap-5 cursor-pointer group"
                onClick={() => handleCopy(personalInfo.phone, "Phone number")}
              >
                <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl group-hover:scale-110 transition-transform"><Phone size={24} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Phone Number</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{personalInfo.phone}</p>
                </div>
              </div>
              <div
                className="flex items-center gap-5 cursor-pointer group"
                onClick={() => handleCopy(personalInfo.email, "Email address")}
              >
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform"><Mail size={24} /></div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors break-all">{personalInfo.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl"><MapPin size={24} /></div>
                <div><p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Location</p><p className="text-xl font-bold text-slate-900 dark:text-white">{personalInfo.location}</p></div>
              </div>
            </div>
          </div>
        </div>

        <Spline scene="https://prod.spline.design/IZIKekGYwjUY1SNr/scene.splinecode" />
        {/* <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden h-[400px] lg:h-full min-h-[500px]">
          <div className="absolute inset-0 z-0">
          </div>
          <div className="absolute inset-0 z-10 flex items-end justify-center pb-8 pointer-events-none">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 dark:bg-blue-600/20 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-white uppercase tracking-tighter">Live Preview</span>
            </motion.button>
          </div>
        </div> */}
      </div>
    </section>
  );
}

// --- MAIN PORTFOLIO CLIENT (Chỉ hiển thị, không fetch) ---

export default function PortfolioClient({ initialData }: { initialData: any }) {
  // Nhận data từ props luôn, KHÔNG cần loading state nữa
  const data = initialData;
  const [showIntro, setShowIntro] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [githubUsername, setGithubUsername] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Logic Intro & Theme
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) setShowIntro(true);
    setSelectedYear(new Date().getFullYear());

    // Xử lý username github từ data có sẵn
    if (data?.personalInfo?.github) {
      const username = data.personalInfo.github.split('/').pop() || '';
      setGithubUsername(username);
    }
  }, [data]); // Chạy 1 lần khi có data

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  useEffect(() => {
    if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      setDarkMode(true); document.documentElement.classList.add('light');
    } else {
      setDarkMode(false); document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark'); localStorage.theme = 'light'; setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark'); localStorage.theme = 'dark'; setDarkMode(true);
    }
  };

  // Logic Scroll Active Nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) { const rect = element.getBoundingClientRect(); return rect.top <= 200 && rect.bottom >= 200; }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logic Khôi phục vị trí cuộn (Đã tối ưu thứ tự Hook)
  useEffect(() => {
    if (data) {
      const savedPos = sessionStorage.getItem("projectScrollPos");
      if (savedPos) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPos), behavior: "instant" });
          sessionStorage.removeItem("projectScrollPos");
        }, 100);
      }
    }
  }, [data]);

  // Nếu không có data (lỗi server), return null hoặc trang lỗi
  if (!data) return null;

  const { personalInfo, skills, experiences, projects } = data;
  const roles = personalInfo.title.split('|').map((r: string) => r.trim());
  const navItems = ['About', 'Skills', 'Experience', 'Projects', 'Contact'];

  return (
    <>
      <AnimatePresence>{showIntro && <TerminalIntro onComplete={handleIntroComplete} />}</AnimatePresence>
      {!showIntro && (
        <div className="min-h-screen font-sans selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-200 overflow-x-hidden relative transition-colors duration-500">
          <ScrollToTop />
          <CustomCursor />
          <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 origin-left z-[70]" style={{ scaleX }} />

          {/* Background Effects */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] dark:opacity-[0.2]" />
            <motion.div animate={{ x: [0, 50, 0], y: [0, -50, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px]" />
            <motion.div animate={{ x: [0, -50, 0], y: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 1 }} className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[120px]" />
          </div>

          {/* ... PHẦN HEADER VÀ MOBILE NAV GIỮ NGUYÊN ... */}
          <div className="hidden md:flex fixed top-6 left-0 right-0 justify-center z-50 px-4 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-4">
              <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/50 rounded-full px-6 py-3 flex items-center gap-1">
                <span className="font-bold text-slate-800 dark:text-white mr-4">{personalInfo.name.split(' ').pop()}</span>
                {navItems.map((item) => {
                  const id = item.toLowerCase();
                  const isActive = activeSection === id;
                  return (
                    <a key={item} href={`#${id}`} onClick={() => setActiveSection(id)} className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>{item}{isActive && (<motion.span layoutId="activeNav" className="absolute inset-0 border-2 border-blue-100 dark:border-blue-500/30 rounded-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />)}</a>
                  );
                })}
              </motion.nav>
              <motion.button initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={toggleTheme} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 rounded-full border border-white/20 dark:border-slate-700/50 shadow-lg hover:scale-110 transition-transform text-slate-700 dark:text-yellow-400">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</motion.button>
            </div>
          </div>

          <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50">
            <span className="font-bold text-slate-900 dark:text-white text-lg">{personalInfo.name.split(' ').pop()}</span>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><Menu size={28} /></button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col md:hidden">
                <div className="p-4 flex justify-end border-b border-slate-100 dark:border-slate-800"><button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><X size={32} /></button></div>
                <div className="flex-1 flex flex-col items-center justify-center gap-8">{navItems.map((item, index) => (<motion.a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="text-3xl font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400">{item}</motion.a>))}</div>
                <div className="p-8 text-center text-slate-400 text-sm">© 2025 {personalInfo.name}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button onClick={toggleTheme} whileTap={{ scale: 0.9 }} className="md:hidden fixed bottom-6 right-6 z-[60] p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full text-slate-800 dark:text-yellow-400 shadow-xl border border-slate-200 dark:border-slate-700">{darkMode ? <Sun size={24} /> : <Moon size={24} />}</motion.button>

          {/* MAIN CONTENT */}
          <main className="max-w-6xl mx-auto px-4 md:px-8 pb-24 pt-32 relative z-10">
            {/* HERO SECTION */}
            <section id="about" className="min-h-[85vh] flex flex-col justify-center mb-20 scroll-mt-32">
              {/* ... Nội dung Hero Section giữ nguyên ... */}
              {/* Chỉ lưu ý: Phần Avatar dùng Image tối ưu */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* LEFT COL */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="order-2 lg:order-1">
                  {/* ... Các phần text giới thiệu ... */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-xs font-semibold mb-6"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>Available for work</div>
                  <div className="h-8 md:h-10 mb-4 text-xl md:text-2xl font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2 overflow-hidden">
                    <span className="flex-shrink-0">I am a</span>
                    <span className="font-bold text-slate-800 dark:text-blue-400">
                      <Typewriter texts={roles} />
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6"><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 animate-gradient bg-300%">{personalInfo.name}</span></h1>
                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-lg">{personalInfo.summary}</p>

                  {/* Education & Achievement Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {personalInfo.university && (<div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-700/50"><div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shrink-0"><GraduationCap size={20} /></div><div><p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Education</p><p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{personalInfo.university}</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{personalInfo.degree} {personalInfo.graduationType && `• ${personalInfo.graduationType}`}</p></div></div>)}
                    {(personalInfo.gpa || personalInfo.languages) && (<div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-700/50"><div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shrink-0"><Award size={20} /></div><div><p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Achievements</p><div className="flex flex-col gap-2">{personalInfo.gpa && (<div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"><GraduationCap size={16} className="text-blue-600 dark:text-blue-400" /><span>GPA: {personalInfo.gpa}</span></div>)}{personalInfo.languages && (<div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"><Globe size={16} className="text-blue-600 dark:text-blue-400" /><span>{personalInfo.languages}</span></div>)}</div></div></div>)}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <motion.a href={`https://${personalInfo.github}`} target="_blank" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full font-medium shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2"><Github size={20} /> Github</motion.a>
                    {personalInfo.cvPath && (<motion.a href={personalInfo.cvPath} download whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-5 py-2 rounded-full font-medium border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"><Monitor size={20} /> Download CV</motion.a>)}
                    <motion.a href={`mailto:${personalInfo.email}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-5 py-2 rounded-full font-medium border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"><Mail size={20} /> Email</motion.a>
                  </div>
                </motion.div>

                {/* RIGHT COL - AVATAR */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="order-1 lg:order-2 flex justify-center relative"
                >
                  <div className="relative w-72 h-72 md:w-96 md:h-96">
                    {/* Vòng glow phía sau */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 blur-3xl animate-pulse" />

                    <motion.div
                      animate={{ y: [-8, 8] }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "mirror",
                        duration: 4, // Tăng thời gian để float chậm và mượt hơn
                        ease: "easeInOut"
                      }}
                      className="relative w-full h-full smooth-float" // Thêm class smooth-float
                    >
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative z-10 bg-slate-100">
                        {personalInfo.avatar ? (
                          <Image
                            src={personalInfo.avatar}
                            alt="Avatar"
                            fill
                            priority
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            sizes="(max-width: 768px) 288px, 384px"
                          />
                        ) : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-300">Me</div>}
                      </div>
                    </motion.div>

                    {/* Badge 1 - Tối ưu chữ không bị khựng */}
                    <motion.div
                      animate={{ y: [0, -12] }}
                      transition={{ repeat: Infinity, repeatType: "mirror", duration: 3, ease: "easeInOut" }}
                      className="absolute -right-4 top-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 z-20 smooth-float"
                    >
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 flex-shrink-0">
                        <Code2 size={20} />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Role</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">Dev & BA</p>
                      </div>
                    </motion.div>

                    {/* Badge 2 - Tối ưu chữ không bị khựng */}
                    <motion.div
                      animate={{ y: [0, 12] }}
                      transition={{ repeat: Infinity, repeatType: "mirror", duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -left-4 bottom-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 z-20 smooth-float"
                    >
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 flex-shrink-0">
                        <Calendar size={20} />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Exp</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white whitespace-nowrap">1+ Years</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* SKILLS SECTION */}
            <section id="skills" className="mb-32 scroll-mt-28">
              {/* ... (Giữ nguyên logic render skills của bạn) ... */}
              <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 relative inline-block">Tech Stack<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span></h2><p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-6">My arsenal of tools for building scalable applications.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"><Database size={24} /></div><h3 className="text-lg font-bold text-slate-800 dark:text-white">Backend & Database</h3></div><div className="flex flex-wrap gap-2">{[...(skills.programming_Languages || []), ...(skills.backend || []), ...(skills.databases || [])].map((s: string, i: number) => (<SkillBadge key={`${s}-${i}`} item={s} />))}</div></div>
                <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400"><Monitor size={24} /></div><h3 className="text-lg font-bold text-slate-800 dark:text-white">Frontend & UI</h3></div><div className="flex flex-wrap gap-2">{[...(skills.frontend || []), ...(skills.mobile || []), ...(skills.design_tools || [])].map((s: string, i: number) => (<SkillBadge key={`${s}-${i}`} item={s} />))}</div></div>
                <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"><div className="flex items-center gap-3 mb-4"><div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400"><Wrench size={24} /></div><h3 className="text-lg font-bold text-slate-800 dark:text-white">Tools & Others</h3></div><div className="flex flex-wrap gap-2">{[...(skills.development_tools || []), ...(skills.testing || []), ...(skills.cms || [])].map((s: string, i: number) => (<SkillBadge key={`${s}-${i}`} item={s} />))}</div></div>
              </div>
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"><div className="flex items-center gap-3"><div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300"><GitCommit size={24} /></div><h3 className="text-xl font-bold text-slate-800 dark:text-white">Coding Activity</h3></div></div>{githubUsername ? (<div className="w-full overflow-x-auto pb-2 scrollbar-hide"><img src={`https://ghchart.rshah.org/3b82f6/${githubUsername}?y=${selectedYear}`} alt={`GitHub Contributions ${selectedYear}`} className="w-full min-w-[600px] dark:opacity-80 dark:invert-[0.1]" /><p className="text-xs text-slate-400 mt-4 text-center">Contributions in {selectedYear} • <a href={`https://github.com/${githubUsername}`} target="_blank" className="underline hover:text-blue-500">View Profile</a></p></div>) : (<p className="text-slate-500">Github username not found.</p>)}</div>
            </section>

            {/* EXPERIENCE SECTION */}
            <section id="experience" className="mb-32 scroll-mt-28">
              <div className="flex flex-col md:flex-row justify-between items-start mb-12"><div><h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Work History</h2><p className="text-slate-500 dark:text-slate-400">My professional journey.</p></div></div>
              <div className="space-y-0">{experiences.map((exp: any, index: number) => (<ExperienceItem key={exp.id} exp={exp} index={index} />))}</div>
            </section>

            {/* PROJECTS SECTION */}
            <section id="projects" className="mb-32 scroll-mt-28">
              <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 relative inline-block">Featured Projects<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span></h2><p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-6">Selected works demonstrating my capabilities.</p></div>
              <div className="space-y-24 md:space-y-32">
                {projects.map((project: any, index: number) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </section>

            {/* CONTACT SECTION */}
            <ContactSection personalInfo={personalInfo} />

          </main>
          <footer className="py-12 text-center text-slate-400 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 backdrop-blur-sm"><div className="max-w-6xl mx-auto px-4"><p className="mb-4">© 2025 {personalInfo.name}. Built with Next.js & Tailwind.</p><div className="flex justify-center gap-6"><a href={`https://${personalInfo.github}`} className="hover:text-blue-500 transition-colors">Github</a><a href={`mailto:${personalInfo.email}`} className="hover:text-blue-500 transition-colors">Contact</a></div></div></footer>
        </div>
      )}
    </>
  );
}