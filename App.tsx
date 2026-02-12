
import React, { useState, useEffect } from 'react';
import { User, ContentItem, UserRole } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContentDetail from './pages/ContentDetail';
import AdminLogs from './pages/AdminLogs';
import Upload from './pages/Upload';
import Layout from './components/Layout';
import { DB } from './lib/mockDb';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    // Check local storage session
    const savedUser = localStorage.getItem('secureshield_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setContent(DB.getContent());
  }, []);

  const handleLogin = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem('secureshield_session', JSON.stringify(authenticatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('secureshield_session');
    setActiveTab('dashboard');
    setSelectedContentId(null);
  };

  const refreshContent = () => {
    setContent(DB.getContent());
    setActiveTab('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    // Content Detail view takes precedence
    if (selectedContentId) {
      return (
        <ContentDetail 
          contentId={selectedContentId} 
          user={user} 
          onBack={() => setSelectedContentId(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            content={content} 
            user={user} 
            onViewContent={(id) => setSelectedContentId(id)} 
          />
        );
      case 'upload':
        if (user.role === UserRole.VIEWER) return <div className="p-10 text-center text-red-400">Unauthorized</div>;
        return <Upload user={user} onSuccess={refreshContent} />;
      case 'logs':
        if (user.role !== UserRole.ADMIN) return <div className="p-10 text-center text-red-400">Unauthorized</div>;
        return <AdminLogs />;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setSelectedContentId(null);
        setActiveTab(tab);
      }}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
