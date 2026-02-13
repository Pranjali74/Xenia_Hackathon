
import React, { useState } from 'react';
import { User, ContentType, UserRole, ContentItem } from '../types';
import { DB } from '../lib/mockDb';

interface UploadProps {
  user: User;
  onSuccess: () => void;
}

const Upload: React.FC<UploadProps> = ({ user, onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video' as ContentType,
    allowedRoles: [UserRole.VIEWER] as UserRole[]
  });
  const [fileData, setFileData] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use object URL to avoid expensive base64 encoding for large files
      const url = URL.createObjectURL(file);
      setFileData(url);
    }
  };

  const handleToggleRole = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      allowedRoles: prev.allowedRoles.includes(role)
        ? prev.allowedRoles.filter(r => r !== role)
        : [...prev.allowedRoles, role]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileData) return alert('Please select a file');

    setIsUploading(true);
    // Simulate API delay
    setTimeout(() => {
      const newItem: ContentItem = {
        id: Math.random().toString(36).substring(7),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        storageKey: fileData, // In this demo, storageKey holds the base64
        allowedRoles: formData.allowedRoles,
        uploadedBy: user.id,
        createdAt: Date.now()
      };

      const existing = DB.getContent();
      DB.saveContent([newItem, ...existing]);
      setIsUploading(false);
      // Dispatch a simple toast event for success
      window.dispatchEvent(new CustomEvent('secureshield:toast', { detail: { message: 'Content uploaded successfully', type: 'success' } }));
      onSuccess();
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Ingest Secure Content</h2>
        <p className="text-gray-400 mt-1">Protected assets are automatically watermarked upon retrieval.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6 shadow-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Resource Title</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              placeholder="e.g., Annual Strategy Review"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <textarea 
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white h-32 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              placeholder="Brief summary of the content and its importance..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Content Type</label>
              <select 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as ContentType})}
              >
                <option value="video">Video MP4</option>
                <option value="image">Image (PNG / JPG)</option>
                <option value="pdf">Document PDF</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">File Upload</label>
              <input 
                type="file" 
                accept={
                  formData.type === 'video' ? 'video/*' : formData.type === 'image' ? 'image/*' : 'application/pdf'
                }
                className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Authorized Roles (Who can view?)</label>
            <div className="flex flex-wrap gap-3">
              {[UserRole.ADMIN, UserRole.UPLOADER, UserRole.VIEWER].map(role => (
                <button
                  type="button"
                  key={role}
                  onClick={() => handleToggleRole(role)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.allowedRoles.includes(role)
                    ? 'bg-indigo-600/20 border-indigo-600 text-indigo-400'
                    : 'bg-gray-800 border-gray-700 text-gray-500'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          disabled={isUploading}
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Securing Content...</span>
            </>
          ) : (
            <span>Publish Protected Asset</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Upload;
