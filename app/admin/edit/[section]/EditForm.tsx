// app/admin/edit/[section]/EditForm.tsx
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { Trash2, Edit, Plus, Save, Upload, Image, FileText, X, CheckCircle, AlertCircle, Loader2, ImageIcon, Globe, Lock, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SectionName = 'personalInfo' | 'skills' | 'experiences' | 'projects';

interface EditFormProps {
    sectionName: SectionName;
    initialData: any;
    updateAction: (sectionName: string, newData: any) => Promise<{ success: boolean; message: string }>;
    deleteAction?: (sectionName: string, id: number) => Promise<{ success: boolean; message: string }>;
    isSingleObject?: boolean;
}

// 1. MANG STYLE RA NGOÀI
const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600";
const labelClasses = "text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 mb-1 block";
const cardClasses = "bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 transition-all p-6";

// 2. MANG COMPONENT INPUTFIELD RA NGOÀI (Sửa lỗi mất focus)
const InputField = ({ label, name, value, onChange, placeholder, isTextArea = false, rows = 3 }: any) => (
    <div className="space-y-1">
        <label className={labelClasses}>{label}</label>
        {isTextArea ? (
            <textarea
                name={name}
                value={value || ''}
                onChange={onChange}
                rows={rows}
                placeholder={placeholder}
                className={inputClasses}
                
            />
        ) : (
            <input
                type="text"
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClasses}
                
            />
        )}
    </div>
);

const getInitialItemState = (sectionName: string) => {
    switch (sectionName) {
        case 'personalInfo': return {
            name: '',
            title: '',
            location: '',
            phone: '',
            email: '',
            github: '',
            summary: '',
            university: '',
            degree: '',
            graduationType: '',
            gpa: '',
            languages: ''
        };
        case 'skills': return { languages: '', frontend: '', backend: '', mobileTools: '', designBA: '' };
        case 'experiences': return { company: '', role: '', period: '', description: '' };
        case 'projects': return { 
            name: '', role: '', stack: '', overview: '', solution: '', 
            github: '', demo: '', video: '', visibility: 'Public', images: [] 
        };
        default: return {};
    }
};

export function EditForm({ sectionName, initialData, updateAction, deleteAction, isSingleObject = false }: EditFormProps) {
    const router = useRouter();
    const isSkills = sectionName === 'skills';
    const isProjects = sectionName === 'projects';

    const getInitialEditItem = () => {
        if (isSingleObject) {
            if (isSkills) {
                const skillsAsString: any = {};
                Object.keys(initialData).forEach(key => {
                    skillsAsString[key] = Array.isArray(initialData[key]) ? initialData[key].join(', ') : initialData[key];
                });
                return skillsAsString;
            }
            return initialData;
        }
        return getInitialItemState(sectionName);
    };

    const [listData, setListData] = useState(Array.isArray(initialData) ? initialData : []);
    const [editItem, setEditItem] = useState(getInitialEditItem());
    const [isEditing, setIsEditing] = useState(isSingleObject);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [uploading, setUploading] = useState(false);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);
    const projectImageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (Array.isArray(initialData)) setListData(initialData);
        if (isSingleObject) setEditItem(getInitialEditItem());
    }, [initialData, isSingleObject]);

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditItem((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSkillChange = (name: string, value: string) => {
        const arrayValue = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        setEditItem((prev: any) => ({ ...prev, [name]: arrayValue }));
    }

    const handleEditClick = (item = {}) => {
        const itemToEdit = isSkills ? { ...initialData } : { ...getInitialItemState(sectionName), ...item };
        if (isSkills) {
            Object.keys(itemToEdit).forEach(key => {
                itemToEdit[key] = Array.isArray(initialData[key]) ? initialData[key].join(', ') : initialData[key];
            });
        } else {
            if (itemToEdit.description && Array.isArray(itemToEdit.description)) {
                itemToEdit.description = itemToEdit.description.join('\n');
            }
        }
        setEditItem(itemToEdit);
        setIsEditing(true);
        setMessage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditItem(getInitialItemState(sectionName));
        setMessage(null);
    }

    const handleFileUpload = async (file: File, type: 'avatar' | 'cv' | 'projectImage') => {
        setUploading(true);
        setMessage(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type === 'projectImage' ? 'project' : type);

            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            const result = await response.json();

            if (result.success) {
                if (type === 'projectImage') {
                    setEditItem((prev: any) => ({
                        ...prev,
                        images: [...(prev.images || []), result.url]
                    }));
                    setMessage({ type: 'success', text: `Thêm ảnh thành công!` });
                } else {
                    const fieldName = type === 'avatar' ? 'avatar' : 'cvPath';
                    setEditItem((prev: any) => ({ ...prev, [fieldName]: result.url }));
                    setMessage({ type: 'success', text: `Upload ${type} thành công!` });
                }
            } else {
                setMessage({ type: 'error', text: result.error || 'Upload thất bại' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setUploading(false);
        }
    };

    const removeProjectImage = (indexToRemove: number) => {
        setEditItem((prev: any) => ({
            ...prev,
            images: prev.images.filter((_: any, index: number) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        let dataToSend = { ...editItem };

        if (isSkills) {
            dataToSend = {};
            Object.keys(editItem).forEach(key => {
                dataToSend[key] = String(editItem[key]).split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
            });
        } else if (sectionName === 'experiences' && dataToSend.description) {
            dataToSend.description = typeof dataToSend.description === 'string'
                ? dataToSend.description.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
                : dataToSend.description;
        }

        const result = await updateAction(sectionName, dataToSend);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => { router.refresh(); }, 1000);

            if (!isSingleObject) {
                setIsEditing(false);
                setEditItem(getInitialItemState(sectionName));
            }
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const handleDelete = async (id: number) => {
        if (!deleteAction || !window.confirm("Bạn có chắc chắn muốn xóa mục này?")) return;
        const result = await deleteAction(sectionName, id);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            setTimeout(() => router.refresh(), 1000);
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    }

    const renderFormContent = () => {
        if (isSkills) {
            return (
                <div className="grid grid-cols-1 gap-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <div><strong>Hướng dẫn:</strong> Nhập các kỹ năng cách nhau bởi dấu phẩy.<br />Ví dụ: <code>React, Next.js, Node.js</code></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.keys(initialData).map(key => (
                            <InputField key={key} label={key.replace(/([A-Z])/g, ' $1')} name={key} value={editItem[key]} onChange={(e: any) => handleSkillChange(key, e.target.value)} isTextArea />
                        ))}
                    </div>
                </div>
            );
        }

        const fields = Object.keys(getInitialItemState(sectionName)).filter(key =>
            !['id', 'images', 'avatar', 'cvPath', 'visibility'].includes(key)
        );

        return (
            <div className="space-y-8">
                {/* Personal Info Uploads (Giữ nguyên) */}
                {isSingleObject && !isSkills && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                        {/* ... (Code upload avatar/CV giữ nguyên như cũ) ... */}
                        <div className="space-y-3">
                            <label className={labelClasses}>Ảnh đại diện</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white dark:border-slate-600 shadow-md bg-slate-200 dark:bg-slate-800">
                                    {editItem.avatar ? <img src={editItem.avatar} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><Image size={24} /></div>}
                                </div>
                                <div className="flex-1">
                                    <input ref={avatarInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'avatar')} className="hidden" />
                                    <button type="button" onClick={() => avatarInputRef.current?.click()} disabled={uploading} className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">{uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />} {editItem.avatar ? 'Đổi ảnh' : 'Tải ảnh lên'}</button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className={labelClasses}>CV File (PDF)</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 flex items-center justify-center border border-red-100 dark:border-red-900/30"><FileText size={32} /></div>
                                <div className="flex-1">
                                    <input ref={cvInputRef} type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'cv')} className="hidden" />
                                    <button type="button" onClick={() => cvInputRef.current?.click()} disabled={uploading} className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2">{uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />} {editItem.cvPath ? 'Cập nhật CV' : 'Tải CV lên'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- PHẦN PROJECTS (THÊM MỚI) --- */}
                {isProjects && (
                    <div className="space-y-6">
                        {/* 1. Chọn trạng thái Visibility */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className={labelClasses}>Trạng thái dự án</label>
                                <select
                                    name="visibility"
                                    value={editItem.visibility || 'Public'}
                                    onChange={handleFormChange}
                                    className={inputClasses}
                                >
                                    <option value="Public">Public (Công khai)</option>
                                    <option value="Private">Private (Riêng tư)</option>
                                </select>
                            </div>
                        </div>

                        {/* 2. Upload Ảnh */}
                        <div className="space-y-3 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <label className={labelClasses}>Hình ảnh dự án (Screenshots)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {editItem.images && editItem.images.map((img: string, idx: number) => (
                                    <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <img src={img} className="w-full h-full object-cover" alt="Project" />
                                        <button type="button" onClick={() => removeProjectImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"><X size={12} /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => projectImageInputRef.current?.click()} disabled={uploading} className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800/50 transition-colors text-slate-400 hover:text-blue-500">
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={24} />}
                                    <span className="text-xs mt-2 font-semibold">Thêm ảnh</span>
                                </button>
                                <input ref={projectImageInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'projectImage')} className="hidden" />
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500">* Ảnh đầu tiên sẽ được dùng làm ảnh bìa.</p>
                        </div>
                    </div>
                )}

                {/* Các trường nhập liệu thông thường */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map(field => {
                        const isLong = ['description', 'overview', 'solution', 'summary'].includes(field);
                        return (
                            <div key={field} className={isLong ? "md:col-span-2" : ""}>
                                <InputField label={field.replace(/([A-Z])/g, ' $1')} name={field} value={editItem[field]} onChange={handleFormChange} isTextArea={isLong} rows={isLong ? 5 : 1} placeholder={`Nhập ${field}...`} />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {message && (
                <div className={`p-4 rounded-xl flex items-start gap-3 shadow-lg border animate-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={20} /> : <AlertCircle className="shrink-0 mt-0.5" size={20} />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}

            {(isEditing || isSingleObject) && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    <div className="p-6 md:p-8">
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <span className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">{editItem.id ? <Edit size={24} /> : (isSingleObject ? <Edit size={24} /> : <Plus size={24} />)}</span>
                                    {isSingleObject ? 'Chỉnh sửa thông tin' : (editItem.id ? 'Cập nhật mục' : 'Thêm mục mới')}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 ml-12">Điền thông tin chi tiết vào form bên dưới.</p>
                            </div>
                            {!isSingleObject && <button onClick={handleCancel} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-500 dark:text-slate-400"><X size={20} /></button>}
                        </div>
                        <form onSubmit={handleSubmit}>
                            {renderFormContent()}
                            <div className="mt-10 flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button type="submit" disabled={uploading} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]">{uploading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} {uploading ? 'Đang xử lý...' : 'Lưu Thay Đổi'}</button>
                                {!isSingleObject && <button type="button" onClick={handleCancel} className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition font-medium border border-transparent dark:border-slate-700">Hủy Bỏ</button>}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {!isEditing && !isSingleObject && (
                <div className="flex justify-end"><button onClick={() => handleEditClick()} className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"><Plus size={20} /> Thêm Mục Mới</button></div>
            )}

            {!isEditing && Array.isArray(listData) && listData.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white px-1 border-l-4 border-blue-500 pl-3">Danh sách hiện tại ({listData.length})</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {listData.map((item) => (
                            <div key={item.id} className={cardClasses}>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.company || item.name}</h4>
                                            {item.period && <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-600">{item.period}</span>}
                                        </div>
                                        {(item.role || item.stack) && <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{item.role || item.stack}</div>}
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl leading-relaxed">{Array.isArray(item.description) ? item.description.join(', ') : (item.description || item.overview)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                        <button onClick={() => handleEditClick(item)} className="p-2.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition border border-blue-100 dark:border-blue-900/50" title="Sửa"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition border border-red-100 dark:border-red-900/50" title="Xóa"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}