import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import PDFViewer from '../../components/medical-records/PDFViewer';
import { FileCheck2, UploadCloud, Eye, Download, Calendar, User } from 'lucide-react';

export default function ReportHistoryPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const res = await api.get('/laboratories/dashboard');
        if (res.success) {
          setReports(res.data.recentReports || []);
        }
      } catch (err) {
        console.error('Failed to load reports history', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Audit Archive</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Uploaded Laboratory Reports</h1>
          <p className="text-xs text-slate-500">Certified digital reports delivered to patient medical vaults</p>
        </div>

        <Link
          to="/laboratory/reports/upload"
          className="btn-primary text-xs py-2 px-3.5 shadow-sm flex items-center gap-1.5"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Report</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading report archive..." />
      ) : reports.length === 0 ? (
        <EmptyState
          title="No uploaded reports"
          message="No reports uploaded by your laboratory center yet."
          action={
            <Link to="/laboratory/reports/upload" className="btn-primary text-xs py-1.5 px-3">
              Upload Report
            </Link>
          }
        />
      ) : (
        <div className="card p-0 bg-white border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50">
                  <th className="py-3 px-4">Report Reference & Filename</th>
                  <th className="py-3 px-4">Patient Unique ID</th>
                  <th className="py-3 px-4">Test Profile</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Upload Date</th>
                  <th className="py-3 px-4 text-right">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map(rep => (
                  <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-900 block font-bold">{rep.report_title}</strong>
                      <span className="font-mono text-[10px] text-slate-400">{rep.pdf_filename}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {rep.patient_unique_id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {rep.test_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={rep.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {rep.report_date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveViewerDoc({ id: rep.id, filename: rep.pdf_filename })}
                        className="btn-secondary text-xs py-1.5 px-2.5 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" /> View PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
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
