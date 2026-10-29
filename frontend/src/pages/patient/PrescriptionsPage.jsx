import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import PDFViewer from '../../components/medical-records/PDFViewer';
import { Pill, Calendar, User, Eye, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);

  useEffect(() => {
    async function loadPrescriptions() {
      try {
        setLoading(true);
        const res = await api.get('/patients/prescriptions');
        if (res.success) {
          setPrescriptions(res.prescriptions);
        }
      } catch (err) {
        console.error('Failed to load prescriptions', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrescriptions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Clinical Pharmacotherapy</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">My Prescriptions</h1>
        <p className="text-xs text-slate-500">Authorized medical prescriptions issued by consulting doctors</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving authorized prescriptions..." />
      ) : prescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions on file"
          message="You do not currently have any active clinical prescriptions. When a consulting doctor concludes an appointment, your prescription will be delivered here."
        />
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="card p-5 bg-white border border-slate-200 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-bold border border-teal-200">
                    {rx.prescription_id}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {rx.pdf_filename}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{rx.disease_name || 'General Medical Consultation'}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span>Prescribed by {rx.doctor_name}</span>
                  </p>
                </div>

                {/* Medication Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(rx.medications || []).map((med, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                      <Pill className="w-3 h-3 text-primary" />
                      {med.name} {med.dosage} ({med.frequency})
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 font-medium">
                  Issued Date: {rx.created_at?.split('T')[0]} &bull; Follow-up: {rx.follow_up_date || 'As required'}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => setActiveViewerDoc({ id: rx.id, filename: rx.pdf_filename })}
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
