import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import PDFViewer from '../../components/medical-records/PDFViewer';
import { TestTube2, Building, Calendar, Eye, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LaboratoryReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const res = await api.get('/patients/laboratory-reports');
        if (res.success) {
          setReports(res.reports);
        }
      } catch (err) {
        console.error('Failed to load lab reports', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Diagnostic Pathology</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Laboratory Test Reports</h1>
        <p className="text-xs text-slate-500">Certified digital test reports uploaded directly by accredited laboratories</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving laboratory reports..." />
      ) : reports.length === 0 ? (
        <EmptyState
          title="No laboratory reports available"
          message="You have no diagnostic reports uploaded yet. Reports will appear automatically when testing is completed."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div key={rep.id} className="card p-5 bg-white border border-slate-200 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded font-bold border border-indigo-200">
                    {rep.report_id}
                  </span>
                  <StatusBadge status={rep.status} />
                  <span className="font-mono text-[10px] text-slate-400">
                    {rep.pdf_filename}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{rep.report_title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-primary" />
                    <span>Analyzed by {rep.lab_name}</span>
                  </p>
                </div>

                {/* Test Results Summary Preview */}
                {rep.test_results && Object.keys(rep.test_results).length > 0 && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-wrap gap-4 text-[11px]">
                    {Object.entries(rep.test_results).map(([key, val]) => (
                      <span key={key} className="text-slate-600">
                        <strong className="capitalize font-semibold text-slate-800">{key.replace('_', ' ')}:</strong> {val}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 font-medium">
                  Report Date: {rep.report_date} &bull; Specimen: Complete Blood
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => setActiveViewerDoc({ id: rep.id, filename: rep.pdf_filename })}
                  className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Certified PDF</span>
                </button>
              </div>
            </div>
          ))}
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
