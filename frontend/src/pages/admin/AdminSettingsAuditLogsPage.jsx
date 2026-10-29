import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ScrollText, Shield, KeyRound, Server, Search, Filter } from 'lucide-react';

export default function AdminSettingsAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const res = await api.get('/admin/audit-logs');
        if (res.success) {
          setLogs(res.auditLogs);
        }
      } catch (err) {
        console.error('Failed to load audit logs', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filtered = logs.filter(l => {
    if (search && !l.action.toLowerCase().includes(search.toLowerCase()) && !l.resource_type.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Security & Governance</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Platform Settings & Security Audit Logs</h1>
          <p className="text-xs text-slate-500">Immutable audit trails for administrative decisions, provider verifications, and consent actions</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Infrastructure Telemetry Configuration */}
      <div className="card p-5 bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block font-medium">Tabular Structured Database</span>
          <strong className="text-slate-900 block mt-0.5">Supabase PostgreSQL</strong>
          <span className="text-[10px] text-emerald-600 font-semibold">Active Pooler Connection</span>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Document Storage Engine</span>
          <strong className="text-slate-900 block mt-0.5">Local Secured Adapter / S3 Capable</strong>
          <span className="text-[10px] text-teal-700 font-semibold">Separated from SQL Storage</span>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Session Security</span>
          <strong className="text-slate-900 block mt-0.5">JWT (1h Access / 7d Revocable)</strong>
          <span className="text-[10px] text-emerald-600 font-semibold">Cryptographically Signed</span>
        </div>
      </div>

      {/* Audit Logs Table */}
      {loading ? (
        <LoadingSpinner message="Decrypting platform security audit trails..." />
      ) : (
        <div className="card p-0 bg-white border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50">
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Resource Target</th>
                  <th className="py-3 px-4">Actor Role</th>
                  <th className="py-3 px-4">Network IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <strong className="capitalize">{log.resource_type}:</strong> {log.resource_id}
                    </td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-primary">
                      {log.user_role || 'System'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
