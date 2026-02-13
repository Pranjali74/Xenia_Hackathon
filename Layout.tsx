
import React from 'react';
import ToastContainer from './Toast';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  if (!user) return <>{children}</>;

  const navItems = [
    { id: 'dashboard', label: 'Library', icon: '📚' },
    { id: 'upload', label: 'Upload', icon: '📤', roles: [UserRole.ADMIN, UserRole.UPLOADER] },
    { id: 'logs', label: 'Access Logs', icon: '📋', roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center font-black text-white text-lg">SS</div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white">SecureShield</h1>
            <p className="text-xs text-gray-400">Enterprise Content Protection</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.filter(item => !item.roles || item.roles.includes(user.role)).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="mb-4 px-4 py-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Signed in as</p>
            <p className="text-sm font-medium truncate text-gray-200">{user.email}</p>
            <span className={`mt-1 inline-block text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
              user.role === UserRole.ADMIN ? 'bg-red-500/20 text-red-400' : 
              user.role === UserRole.UPLOADER ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {user.role}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
          {children}
          <ToastContainer />
      </main>
    </div>
  );
};

export default Layout;
