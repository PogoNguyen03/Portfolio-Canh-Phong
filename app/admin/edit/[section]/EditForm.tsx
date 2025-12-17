// app/admin/edit/[section]/EditForm.tsx
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { Trash2, Edit, Plus, Save, Upload, Image, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Type definitions
type SectionName = 'personalInfo' | 'skills' | 'experiences' | 'projects';

interface EditFormProps {
    sectionName: SectionName;
    initialData: any;
    updateAction: (sectionName: string, newData: any) => Promise<{ success: boolean; message: string }>;
    deleteAction?: (sectionName: string, id: number) => Promise<{ success: boolean; message: string }>;
    isSingleObject?: boolean;
}

const getInitialItemState = (sectionName: string) => {
    switch (sectionName) {
        case 'personalInfo':
            return {}; // Sẽ được điền bằng initialData
        case 'skills':
            return {
                languages: '', frontend: '', backend: '', mobileTools: '', designBA: ''
            };
        case 'experiences':
            return { company: '', role: '', period: '', description: '' };
        case 'projects':
            return { name: '', stack: '', overview: '', solution: '' };
        default:
            return {};
    }
};

export function EditForm({ sectionName, initialData, updateAction, deleteAction, isSingleObject = false }: EditFormProps) {
    const router = useRouter();
    const isSkills = sectionName === 'skills';
    
    // Khởi tạo editItem với dữ liệu ban đầu
    const getInitialEditItem = () => {
        if (isSingleObject) {
            if (isSkills) {
                // Chuyển mảng skills thành chuỗi để hiển thị
                const skillsAsString: any = {};
                Object.keys(initialData).forEach(key => {
                    skillsAsString[key] = Array.isArray(initialData[key]) 
                        ? initialData[key].join(', ') 
                        : initialData[key];
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
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);

    // Debug: Log dữ liệu nhận được
    useEffect(() => {
        console.log('=== EditForm Debug ===');
        console.log('sectionName:', sectionName);
        console.log('initialData:', initialData);
        console.log('initialData type:', typeof initialData);
        console.log('initialData isArray:', Array.isArray(initialData));
        console.log('initialData keys:', initialData ? Object.keys(initialData) : 'null');
        console.log('isSingleObject:', isSingleObject);
        console.log('editItem:', editItem);
    }, [sectionName, initialData, isSingleObject, editItem]);

    // Cập nhật listData và editItem khi initialData thay đổi
    useEffect(() => {
        if (Array.isArray(initialData)) {
            setListData(initialData);
        }
        if (isSingleObject) {
            if (isSkills) {
                // Chuyển mảng skills thành chuỗi để hiển thị
                const skillsAsString: any = {};
                Object.keys(initialData).forEach(key => {
                    skillsAsString[key] = Array.isArray(initialData[key]) 
                        ? initialData[key].join(', ') 
                        : initialData[key];
                });
                setEditItem(skillsAsString);
            } else {
                setEditItem(initialData);
            }
        }
    }, [initialData, isSingleObject, isSkills]);

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditItem((prev: any) => ({ ...prev, [name]: value }));
    };
    
    // Xử lý thay đổi mảng skill
    const handleSkillChange = (name: string, value: string) => {
         // Lưu dưới dạng mảng (split bằng dấu phẩy)
        const arrayValue = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        setEditItem((prev: any) => ({ 
            ...prev, 
            [name]: arrayValue 
        }));
    }

    const handleEditClick = (item = {}) => {
        // Chỉnh sửa item đã có hoặc Reset form cho mục mới
        const itemToEdit = isSkills 
            ? { ...initialData }
            : { ...getInitialItemState(sectionName), ...item };
            
        // Chuyển mảng thành chuỗi để hiển thị trong textarea
        if(isSkills) {
             Object.keys(itemToEdit).forEach(key => {
                 itemToEdit[key] = Array.isArray(initialData[key]) ? initialData[key].join(', ') : initialData[key];
             });
        } else {
            // Chuyển mảng description thành chuỗi (mỗi item một dòng)
            if (itemToEdit.description && Array.isArray(itemToEdit.description)) {
                itemToEdit.description = itemToEdit.description.join('\n');
            }
        }
        
        setEditItem(itemToEdit);
        setIsEditing(true);
        setMessage('');
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        setEditItem(getInitialItemState(sectionName));
        setMessage('');
    }

    const handleFileUpload = async (file: File, type: 'avatar' | 'cv') => {
        setUploading(true);
        setMessage('Đang upload...');
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            const result = await response.json();
            
            if (result.success) {
                const fieldName = type === 'avatar' ? 'avatar' : 'cvPath';
                setEditItem((prev: any) => ({ ...prev, [fieldName]: result.url }));
                setMessage(`✅ Upload ${type === 'avatar' ? 'ảnh đại diện' : 'CV'} thành công!`);
            } else {
                setMessage(`❌ Lỗi: ${result.error || 'Upload thất bại'}`);
            }
        } catch (error: any) {
            setMessage(`❌ Lỗi: ${error.message || 'Upload thất bại'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file, 'avatar');
        }
    };

    const handleCvChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file, 'cv');
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('Đang xử lý...');

        // Chuẩn bị dữ liệu gửi đi (chuyển chuỗi skill lại thành mảng nếu cần)
        let dataToSend = { ...editItem };
        if (isSkills) {
             dataToSend = {};
             Object.keys(editItem).forEach(key => {
                 dataToSend[key] = String(editItem[key]).split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
             });
        } else if (sectionName === 'experiences' && dataToSend.description) {
            // Chuyển chuỗi description (phân cách bởi \n) thành mảng
            dataToSend.description = typeof dataToSend.description === 'string' 
                ? dataToSend.description.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
                : dataToSend.description;
        }
        
        // Gọi Server Action
        const result = await updateAction(sectionName, dataToSend);

        if (result.success) {
            setMessage(`✅ ${result.message}`);
            
            // Reload trang để lấy dữ liệu mới từ server
            setTimeout(() => {
                router.refresh();
            }, 1000);
            
            if (!isSingleObject) {
                 setIsEditing(false); // Đóng form nếu không phải là object đơn
                 setEditItem(getInitialItemState(sectionName));
            }

        } else {
            setMessage(`❌ Lỗi: ${result.message}`);
        }
    };
    
    const handleDelete = async (id: number) => {
        if (!deleteAction) {
            setMessage('❌ Lỗi: Không thể xóa - deleteAction không được cung cấp');
            return;
        }
        if (!window.confirm("Bạn có chắc chắn muốn xóa mục này?")) return;
        
        setMessage('Đang xóa...');
        const result = await deleteAction(sectionName, id);

        if (result.success) {
            setMessage(`✅ ${result.message}`);
            // Reload trang để lấy dữ liệu mới từ server
            setTimeout(() => {
                router.refresh();
            }, 1000);
        } else {
            setMessage(`❌ Lỗi: ${result.message}`);
        }
    }

    const renderListForm = () => {
        const fields = Object.keys(getInitialItemState(sectionName)).filter(key => key !== 'id');

        return (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-4">
                <h3 className="text-xl font-bold mb-4 text-black">{editItem.id ? 'Sửa mục' : 'Thêm mới'}</h3>
                
                {fields.map(field => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-slate-700 capitalize mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
                        {field === 'description' || field === 'overview' || field === 'solution' ? (
                            <textarea
                                name={field}
                                value={editItem[field] || ''}
                                onChange={handleFormChange}
                                rows={3}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                                required
                            />
                        ) : (
                            <input
                                type="text"
                                name={field}
                                value={editItem[field] || ''}
                                onChange={handleFormChange}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500  text-black"
                                required
                            />
                        )}
                    </div>
                ))}
                
                <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        <Save size={18} /> Lưu
                    </button>
                    <button type="button" onClick={handleCancel} className="bg-slate-300 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-400 transition">
                        Hủy
                    </button>
                </div>
            </form>
        );
    }
    
    const renderSkillForm = () => {
         if (!initialData || typeof initialData !== 'object') {
             return <div className="p-4 text-red-500">Không có dữ liệu để hiển thị</div>;
         }
         const fields = Object.keys(initialData);

         return (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-4">
                <p className="text-sm text-red-500 mb-4 font-semibold">
                    * Lưu ý: Nhập các mục cách nhau bởi dấu phẩy (ví dụ: HTML5, CSS3, Tailwind)
                </p>
                
                {fields.map(field => (
                    <div key={field}>
                        <label className="block text-sm font-bold text-slate-700 capitalize mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
                        <textarea
                            name={field}
                            // Dùng initialData cho lần load đầu tiên, sau đó dùng editItem.
                            value={editItem[field] || ''}
                            onChange={(e) => handleSkillChange(field, e.target.value)}
                            rows={3}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500  text-black"
                            placeholder="Nhập các kỹ năng cách nhau bởi dấu phẩy..."
                            required
                        />
                    </div>
                ))}
                
                <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        <Save size={18} /> Lưu Kỹ năng
                    </button>
                </div>
            </form>
         )
    }

    const renderPersonalInfoForm = () => {
        if (!initialData || typeof initialData !== 'object') {
            return <div className="p-4 text-red-500">Không có dữ liệu để hiển thị</div>;
        }
        const fields = Object.keys(initialData).filter(field => field !== 'avatar' && field !== 'cvPath');

        return (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-4">
                {/* Upload Avatar */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ảnh đại diện</label>
                    <div className="flex items-center gap-4">
                        {editItem.avatar && (
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-300">
                                <img 
                                    src={editItem.avatar} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
                                    }}
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition disabled:opacity-50"
                            >
                                <Image size={18} />
                                {editItem.avatar ? 'Đổi ảnh' : 'Upload ảnh đại diện'}
                            </button>
                            {editItem.avatar && (
                                <p className="text-xs text-slate-500 mt-1">URL: {editItem.avatar}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upload CV */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">CV (PDF)</label>
                    <div className="flex items-center gap-4">
                        {editItem.cvPath && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FileText size={20} />
                                <span>CV đã được upload</span>
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                ref={cvInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleCvChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => cvInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition disabled:opacity-50"
                            >
                                <Upload size={18} />
                                {editItem.cvPath ? 'Đổi CV' : 'Upload CV'}
                            </button>
                            {editItem.cvPath && (
                                <p className="text-xs text-slate-500 mt-1">URL: {editItem.cvPath}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Other fields */}
                {fields.map(field => (
                    <div key={field}>
                        <label className="block text-sm font-bold text-slate-700 capitalize mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
                        {(field === 'summary') ? (
                            <textarea
                                name={field}
                                value={editItem[field] || ''}
                                onChange={handleFormChange}
                                rows={5}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500  text-black"
                                required
                            />
                        ) : (
                            <input
                                type="text"
                                name={field}
                                value={editItem[field] || ''}
                                onChange={handleFormChange}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500  text-black"
                                required
                            />
                        )}
                    </div>
                ))}
                
                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={uploading} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                        <Save size={18} /> Lưu
                    </button>
                </div>
            </form>
        );
    }


    return (
        <div className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg font-semibold ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            
            {/* Form chỉnh sửa */}
            {(isEditing || isSingleObject) && (
                isSkills ? renderSkillForm() : (isSingleObject ? renderPersonalInfoForm() : renderListForm())
            )}
            
            {/* Nút Thêm mới (nếu là danh sách) */}
            {!isEditing && !isSingleObject && (
                <button 
                    onClick={() => handleEditClick()} 
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition shadow-md"
                >
                    <Plus size={18} /> Thêm Mục Mới
                </button>
            )}

            {/* Danh sách hiện tại (nếu là danh sách) */}
            {Array.isArray(listData) && listData.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold mt-8">Danh sách hiện tại:</h3>
                    {listData.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                            <div>
                                <p className="font-bold text-slate-800">{item.company || item.name}</p>
                                <p className="text-sm text-slate-500">{item.role || item.stack} | ID: {item.id}</p>
                            </div>
                            <div className="flex gap-3 mt-3 sm:mt-0">
                                <button 
                                    onClick={() => handleEditClick(item)} 
                                    className="text-blue-600 hover:text-blue-800 transition"
                                >
                                    <Edit size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(item.id)} 
                                    className="text-red-600 hover:text-red-800 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}