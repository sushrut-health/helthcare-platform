import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import PDFViewer from '../../components/medical-records/PDFViewer';
import { FileText, Pill, TestTube2, ShieldCheck, Eye, Download, Search, Filter } from 'lucide-react';

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'prescription', 'lab_report'
  const [search, setSearch] = useState('');
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);

  useEffect(() => {
    async function loadRecords() {
      try {
        setLoading(true);
        const res = await api.get('/patients/medical-records');
        if (res.success) {
          setRecords(res.records);
        }
      } catch (err) {
        console.error('Failed to load medical records', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, []);

  const filtered = records.filter(r => {
    if (categoryFilter !== 'all' && r.type !== categoryFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.provider.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Health Vault</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Sovereign Medical Records</h1>
          <p className="text-xs text-slate-500">Access digitally signed clinical prescriptions and diagnostic lab reports</p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/patient/profile" className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Manage Doctor Access</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto text-xs">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${categoryFilter === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            All Vault Records ({records.length})
          </button>
          <button
            onClick={() => setCategoryFilter('prescription')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${categoryFilter === 'prescription' ? 'bg-primary text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            <Pill className="w-3.5 h-3.5" /> Prescriptions
          </button>
          <button
            onClick={() => setCategoryFilter('lab_report')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${categoryFilter === 'lab_report' ? 'bg-primary text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            <TestTube2 className="w-3.5 h-3.5" /> Lab Reports
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search records or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Records Table / List */}
      {loading ? (
        <LoadingSpinner message="Decrypting sovereign health vault records..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No medical records found"
          message="No records match your selected filter. Prescriptions and lab reports will appear here as soon as consultations conclude."
        />
      ) : (
        <div className="card p-0 bg-white border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50/70">
                  <th className="py-3 px-4">Document Title & Filename</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Healthcare Provider</th>
                  <th className="py-3 px-4">Date Issued</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold">{r.title}</strong>
                      <span className="font-mono text-[10px] text-slate-400 block mt-0.5">{r.filename}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${r.type === 'prescription' ? 'bg-teal-50 text-teal-800' : 'bg-indigo-50 text-indigo-800'}`}>
                        {r.type === 'prescription' ? <Pill className="w-3 h-3 text-primary" /> : <TestTube2 className="w-3 h-3 text-indigo-600" />}
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {r.provider}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {r.date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveViewerDoc({ id: r.documentId, filename: r.filename })}
                        className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> View PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {activeViewerDoc && (
        <PDFViewer
          documentId={activeViewerDoc.id}
          filename={activeViewerDoc.filename}
          onClose={() => setActiveViewerDoc(null)}
        />
      )}
    </div>
  );
}
