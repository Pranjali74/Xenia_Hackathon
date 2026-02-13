
import React, { useState } from 'react';
import { DB } from '../lib/mockDb';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.VIEWER);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const users = DB.getUsers();
      
      if (isRegistering) {
        // Registration Logic
        if (users.some(u => u.email === email)) {
          setError('An account with this email already exists.');
          setIsLoading(false);
          return;
        }

        const newUser: User = {
          id: Math.random().toString(36).substring(7),
          email,
          password,
          role
        };

        const updatedUsers = [...users, newUser];
        DB.saveUsers(updatedUsers);
        onLogin(newUser);
      } else {
        // Login Logic
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          onLogin(user);
        } else {
          setError('Invalid credentials or unauthorized account.');
          setIsLoading(false);
        }
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl shadow-indigo-600/20">S</div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {isRegistering ? 'Create Account' : 'Enterprise Shield'}
          </h2>
          <p className="mt-2 text-gray-500">
            {isRegistering ? 'Setup your secure access profile' : 'Authorized Personnel Only'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Work Email</label>
              <input
                required
                type="email"
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-gray-600"
                placeholder="name@enterprise.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Password</label>
              <input
                required
                type="password"
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-gray-600"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {isRegistering && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Access Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[UserRole.ADMIN, UserRole.UPLOADER, UserRole.VIEWER].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-1 text-[10px] font-black rounded-xl border transition-all ${
                        role === r 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                          : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-600 mt-2 px-1 italic">
                  * Select ADMIN to access system logs.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>{isRegistering ? 'Register Account' : 'Authenticate Session'}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="w-full text-sm text-gray-500 hover:text-indigo-400 transition-colors font-medium"
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </form>

        {!isRegistering && (
          <div className="pt-6 border-t border-gray-800">
            <p className="text-xs text-center text-gray-600 font-medium">Quick Demo Access:</p>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <button 
                onClick={() => { setEmail('admin@enterprise.com'); setPassword('password123'); }}
                className="text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-400 py-2 rounded-lg transition-colors border border-gray-700/50"
              >
                ADMIN: admin@enterprise.com / password123
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
