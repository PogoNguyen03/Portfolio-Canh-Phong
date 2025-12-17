"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Inbox, Calendar, User, Mail as MailIcon, RefreshCcw, Paperclip, Download } from 'lucide-react';
import { getContactMessages } from '@/lib/adminActions';

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        setLoading(true);
        const data = await getContactMessages();
        setMessages(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-800 dark:text-slate-200 p-6 md:p-10 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Inbox className="text-blue-500" /> Inbox
                            </h1>
                            <p className="text-slate-500 text-sm">Messages from recruiters</p>
                        </div>
                    </div>
                    <button onClick={fetchMessages} className="p-2 text-slate-500 hover:text-blue-500 transition-colors" title="Refresh">
                        <RefreshCcw size={20} />
                    </button>
                </div>

                {/* List Messages */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Inbox size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500">No messages yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                            <User size={16} className="text-blue-500" /> {msg.name}
                                        </h3>
                                        <div className="text-slate-500 text-sm flex items-center gap-2">
                                            <MailIcon size={14} /> {msg.email}
                                        </div>
                                    </div>
                                    <div className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                                        <Calendar size={12} />
                                        {new Date(msg.date).toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.message}
                                </div>
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {msg.attachments.map((file: string, index: number) => (
                                            <a
                                                key={index}
                                                href={file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                            >
                                                <Paperclip size={12} />
                                                <span>File {index + 1}</span>
                                                <Download size={12} className="ml-1 opacity-50" />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}