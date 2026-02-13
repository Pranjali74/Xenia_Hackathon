
import React, { useState, useMemo, useEffect } from 'react';
import { ContentItem, User } from '../types';
import { DB } from '../lib/mockDb';
import SkeletonCard from '../components/SkeletonCard';

interface DashboardProps {
  content: ContentItem[];
  user: User;
  onViewContent: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ content, user, onViewContent }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const filteredContent = useMemo(() => {
    const roleFiltered = content.filter(item => item.allowedRoles.includes(user.role));
    const q = query.trim().toLowerCase();
    if (!q) return roleFiltered;
    return roleFiltered.filter(item => (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    ));
  }, [content, user.role, query]);

  useEffect(() => {
    // small UX: show animated skeleton for a short time to indicate load
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [content, query]);

  const logs = DB.getLogs();
  const uniqueViewers = Array.from(new Set(logs.map(l => l.userId))).length;
  const counts = content.reduce((acc, it) => {
    acc[it.type] = (acc[it.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Content Library</h2>
          <p className="text-gray-400 mt-1">Authorized assets for your organization.</p>

          <div className="mt-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search title, description, or type..."
              className="w-full md:w-80 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="text-sm text-gray-500 text-right">
          <div>Showing {filteredContent.length} of {content.length} total assets</div>
          <div className="mt-1">Videos: {counts.video || 0} • Images: {counts.image || 0} • PDFs: {counts.pdf || 0}</div>
          <div className="mt-1">Unique Viewers (logs): {uniqueViewers}</div>
        </div>
      </div>

      {/* Analytics mini-summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Assets Overview</h4>
          <div className="text-white font-bold text-2xl">{content.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total assets in the library</div>
        </div>

        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Unique Viewers</h4>
          <div className="text-white font-bold text-2xl">{uniqueViewers}</div>
          <div className="text-xs text-gray-500 mt-1">Users who interacted (logs)</div>
        </div>

        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Top Viewed</h4>
          <div className="text-sm text-gray-200">
            {(() => {
              const countsByContent: Record<string, number> = {};
              logs.forEach(l => { countsByContent[l.contentId] = (countsByContent[l.contentId] || 0) + 1; });
              const sorted = Object.entries(countsByContent).sort((a,b)=>b[1]-a[1]).slice(0,3);
              if (sorted.length === 0) return <div className="text-xs text-gray-500">No views recorded</div>;
              return sorted.map(([id, c]) => {
                const found = content.find(x=>x.id===id);
                return (<div key={id} className="flex items-center justify-between"><span className="truncate">{found ? found.title : id}</span><span className="text-xs text-gray-400">{c}</span></div>);
              });
            })()}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h3 className="text-xl font-semibold text-gray-300">No Content Available</h3>
          <p className="text-gray-500 mt-2">You don't have permission to access any available assets currently.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map(item => (
            <div 
              key={item.id}
              className="group bg-gray-900 border border-gray-800 rounded-xl p-1 overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 shadow-md flex flex-col relative"
            >
              {/* Security badges */}
              <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
                <span className="px-2 py-1 text-xs rounded-lg bg-black/60 border border-white/10 text-white font-bold">Secured</span>
                <span className="px-2 py-1 text-xs rounded-lg bg-black/40 border border-white/5 text-gray-200">{item.allowedRoles.length} roles</span>
              </div>
              {/* Thumbnail Placeholder */}
              <div className="relative aspect-video bg-gray-800 rounded-t-lg flex items-center justify-center overflow-hidden">
                <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-300">
                  {item.type === 'video' ? '🎬' : '📄'}
                </span>
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors" />
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/50 backdrop-blur-sm text-[10px] font-bold uppercase text-white border border-white/10">
                  {item.type}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed flex-1">
                  {item.description}
                </p>
                
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-medium">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => onViewContent(item.id)}
                    className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-indigo-600 text-white text-sm font-semibold transition-all shadow-sm"
                  >
                    Open Securely
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
