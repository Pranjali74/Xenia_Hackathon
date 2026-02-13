
import React, { useState } from 'react';
import { AccessLog } from '../types';
import { DB } from '../lib/mockDb';

const AdminLogs: React.FC = () => {
  const [logs] = useState<AccessLog[]>(DB.getLogs());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white">System Audit Logs</h2>
        <p className="text-gray-400 mt-1">Real-time tracking of content access and security events.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Resource</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Log ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">No access logs recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{new Date(log.timestamp).toLocaleTimeString()}</div>
                      <div className="text-[10px] text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-200">{log.userEmail}</div>
                      <div className="text-[10px] font-mono text-gray-500 uppercase">UID: {log.userId}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        log.action === 'VIEW' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-200 font-medium">{log.contentTitle}</div>
                      <div className="text-[10px] text-gray-500">RID: {log.contentId}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono text-gray-600">{log.id}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-indigo-600/10 border border-indigo-600/20 rounded-xl">
          <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Total Sessions</p>
          <p className="text-3xl font-black text-white">{logs.length}</p>
        </div>
        <div className="p-6 bg-emerald-600/10 border border-emerald-600/20 rounded-xl">
          <p className="text-xs font-bold text-emerald-400 uppercase mb-1">Active Users</p>
          <p className="text-3xl font-black text-white">{new Set(logs.map(l => l.userId)).size}</p>
        </div>
        <div className="p-6 bg-amber-600/10 border border-amber-600/20 rounded-xl">
          <p className="text-xs font-bold text-amber-400 uppercase mb-1">Security Alerts</p>
          <p className="text-3xl font-black text-white">{logs.filter(l => l.action !== 'VIEW').length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
