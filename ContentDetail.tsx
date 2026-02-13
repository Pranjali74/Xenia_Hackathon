
import React, { useState, useEffect } from 'react';
import { ContentItem, User, AccessLog } from '../types';
import SecurePlayer from '../components/SecurePlayer';
import SecureDocViewer from '../components/SecureDocViewer';
import Watermark from '../components/Watermark';
import { DB } from '../lib/mockDb';

interface ContentDetailProps {
  contentId: string;
  user: User;
  onBack: () => void;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ contentId, user, onBack }) => {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // 1. Simulate Authorization Check
    const timer = setTimeout(() => {
      const items = DB.getContent();
      const found = items.find(i => i.id === contentId);
      
      if (found && found.allowedRoles.includes(user.role)) {
        setContent(found);
        // 2. Simulate Signed Token Generation
        setAccessToken(Math.random().toString(36).substring(7));
        
        // 3. Log Access
        const log: AccessLog = {
          id: Math.random().toString(36).substring(7),
          userId: user.id,
          userEmail: user.email,
          contentId: found.id,
          contentTitle: found.title,
          timestamp: Date.now(),
          action: 'VIEW'
        };
        const logs = DB.getLogs();
        DB.saveLogs([log, ...logs]);
      }
      setIsVerifying(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [contentId, user]);

  useEffect(() => {
    if (accessToken && timeLeft > 0) {
      const countdown = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [accessToken, timeLeft]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">Verifying Permissions...</p>
          <p className="text-sm text-gray-500">Securing your direct access tunnel.</p>
        </div>
      </div>
    );
  }

  if (!content || !accessToken || timeLeft <= 0) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-gray-900 border border-gray-800 rounded-2xl text-center space-y-6 shadow-2xl">
        <div className="text-6xl">🚫</div>
        <h2 className="text-2xl font-bold text-white">Access Expired or Denied</h2>
        <p className="text-gray-400">
          For security reasons, access tokens are short-lived. Please return to the dashboard and re-open this content.
        </p>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-colors w-full"
        >
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="w-56">
            <div className="text-xs font-bold text-gray-400 mb-1">Session Lifetime</div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full ${timeLeft < 60 ? 'bg-red-500' : 'bg-indigo-500'}`}
                style={{ width: `${(timeLeft / 300) * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-gray-400 mt-1">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
          </div>
          <span className="text-xs px-2 py-1 rounded bg-indigo-600/20 text-indigo-400 font-mono border border-indigo-500/20">
            {accessToken}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-black text-white">{content.title}</h1>
          <p className="text-gray-400 max-w-2xl">{content.description}</p>
        </div>

        <div className="rounded-2xl overflow-hidden bg-black shadow-2xl border border-gray-800">
          {content.type === 'video' ? (
            <SecurePlayer url={content.storageKey} email={user.email} userId={user.id} contentTitle={content.title} />
          ) : content.type === 'image' ? (
            <div className="relative w-full h-[800px] bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
              <img src={content.storageKey} alt={content.title} className="max-h-full object-contain w-full" />
              <Watermark email={user.email} userId={user.id} contentTitle={content.title} />
            </div>
          ) : (
            <SecureDocViewer url={content.storageKey} email={user.email} userId={user.id} contentTitle={content.title} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Security Notice</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your identity (<span className="text-white">{user.email}</span>) and current session timestamp are watermarked on this content. 
              External capturing or unauthorized distribution is strictly prohibited and tracked.
            </p>
          </div>
          <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Audit Information</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Action: Secure View<br />
              IP Address: (Masked in Demo)<br />
              Device: {navigator.platform}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
