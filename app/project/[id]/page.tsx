// app/project/[id]/page.tsx
import React from 'react';
import { readData } from '@/lib/adminActions';
import Link from 'next/link';
import {
    ArrowLeft, ExternalLink, Github, Layers, CheckCircle2,
    Lock, Globe, User, Youtube
} from 'lucide-react';
import ProjectGallery from './ProjectGallery';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await readData();
    const project = data.projects.find((p: any) => String(p.id) === id);
    return {
        title: project ? `${project.name} | Project Details` : 'Project Not Found',
    };
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await readData();
    const project = data.projects.find((p: any) => String(p.id) === id);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white font-sans">
                <div className="text-center p-4">
                    <h1 className="text-6xl font-bold mb-4 text-slate-300 dark:text-slate-700">404</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">Project not found.</p>
                    <Link href="/#projects" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-500/30">
                        Back to Portfolio
                    </Link>
                </div>
            </div>
        );
    }

    const stackList = project.stack ? project.stack.split(',').map((s: string) => s.trim()) : [];
    const isPrivate = project.visibility === 'Personal Project';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-slate-200 font-sans selection:bg-blue-500/30">
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] dark:opacity-[0.1]" />
            </div>

            <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
                <Link href="/#projects" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-full hover:scale-110 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-lg group">
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </Link>
            </div>

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-20 md:py-24 relative z-10">
                {/* Header Section */}
                <div className="mb-12 animate-in slide-in-from-bottom-10 fade-in duration-700">
                    <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold tracking-widest uppercase">
                            Project Case Study
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 hidden md:inline">|</span>

                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${isPrivate
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                            }`}>
                            {isPrivate ? <Lock size={12} /> : <Globe size={12} />}
                            {project.visibility || 'Public'}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 leading-tight">
                        {project.name}
                    </h1>

                    {project.role && (
                        <div className="flex items-center gap-2 mb-6 text-base md:text-lg text-blue-600 dark:text-blue-400 font-medium">
                            <User size={20} />
                            <span>Role: {project.role}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {stackList.map((tech: string) => (
                            <span key={tech} className="px-3 py-1.5 md:px-4 md:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-7 space-y-8">
                        <ProjectGallery images={project.images} />

                        {project.video && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Youtube className="text-red-500" /> Project Demo / Intro
                                </h3>
                                <div className="aspect-video rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-black">
                                    <iframe
                                        src={project.video}
                                        title="Project Video"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-5 space-y-6 md:space-y-8">
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"><Layers size={20} /></div> Overview
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">{project.overview}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400"><CheckCircle2 size={20} /></div> Technical Solution
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">{project.solution}</p>
                        </div>

                        <div className="space-y-3 pt-2">
                            {isPrivate ? (
                                <button disabled className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200 dark:border-slate-700">
                                    <Lock size={20} /> Source Code Private
                                </button>
                            ) : (
                                <>
                                    {project.github && (
                                        <a href={project.github} target="_blank" className="flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                            <Github size={20} /> View Source Code
                                        </a>
                                    )}

                                </>
                            )}
                            {project.demo && (
                                <a href={project.demo} target="_blank" className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-2xl font-bold shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                                    <ExternalLink size={20} /> Live Demo
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}