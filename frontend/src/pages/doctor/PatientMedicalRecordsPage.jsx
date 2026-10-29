import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import PDFViewer from '../../components/medical-records/PDFViewer';
import { ShieldCheck, Lock, AlertCircle, ArrowLeft, Eye, Pill, TestTube2, User } from 'lucide-react';

export default function PatientMedicalRecordsPage() {
  const { patientId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);

  useEffect(() => {
    async function loadRecords() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/doctors/patients/${patientId}/medical-records`);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.message || 'Access Denied: Patient consent grant is required.');
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, [patientId]);

  if (loading) return <LoadingSpinner message="Checking server consent authorization & loading patient records..." />;

  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Medical Record Access Denied</h2>
        <p className="text-xs text-slate-600 leading-relaxed bg-rose-50 p-3.5 rounded-xl border border-rose-200">
          {error}
        </p>
        <Link to="/doctor/patient-access-requests" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Go to Access Requests
        </Link>
      </div>
    );
  }

  const { patient, consentGrant, prescriptions, labReports } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/doctor/appointments/today" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary font-medium mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Queue
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Patient Vault: {patient.full_name}</h1>
          <p className="text-xs text-slate-500">Patient ID: <span className="font-mono text-primary font-bold">{patient.patient_id}</span></p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Patient Consent Active
          </span>
        </div>
      </div>

      {/* Patient Clinical Info Card */}
      <div className="card p-5 bg-white border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block font-medium">Age & Gender</span>
          <strong className="text-slate-800">{patient.gender || 'Not specified'}</strong>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Blood Group</span>
          <strong className="text-slate-800">{patient.blood_group || 'Not recorded'}</strong>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Allergies</span>
          <strong className="text-rose-600">{patient.allergies || 'None declared'}</strong>
        </div>
        <div>
          <span className="text-slate-400 block font-medium">Chronic Conditions</span>
          <strong className="text-slate-800">{patient.chronic_conditions || 'None'}</strong>
        </div>
      </div>

      {/* Prescriptions */}
      <div className="card p-6 bg-white border border-slate-200">
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Pill className="w-4 h-4 text-teal-600" />
          <span>Authorized Prescriptions ({prescriptions?.length || 0})</span>
        </h2>

        {prescriptions?.length === 0 ? (
          <p className="text-xs text-slate-500">No prescriptions on file.</p>
        ) : (
          <div className="space-y-3">
            {prescriptions.map(rx => (
              <div key={rx.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold">{rx.disease_name}</strong>
                    <span className="font-mono text-[10px] text-slate-400">{rx.pdf_filename}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Prescribed by {rx.doctor_name} &bull; {rx.created_at?.split('T')[0]}
                  </span>
                </div>
                <button
                  onClick={() => setActiveViewerDoc({ id: rx.id, filename: rx.pdf_filename })}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" /> View PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Diagnostic Lab Reports */}
      <div className="card p-6 bg-white border border-slate-200">
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <TestTube2 className="w-4 h-4 text-indigo-600" />
          <span>Diagnostic Laboratory Reports ({labReports?.length || 0})</span>
        </h2>

        {labReports?.length === 0 ? (
          <p className="text-xs text-slate-500">No diagnostic reports uploaded.</p>
        ) : (
          <div className="space-y-3">
            {labReports.map(rep => (
              <div key={rep.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold">{rep.report_title}</strong>
                    <StatusBadge status={rep.status} />
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {rep.lab_name} &bull; Date: {rep.report_date}
                  </span>
                </div>
                <button
                  onClick={() => setActiveViewerDoc({ id: rep.id, filename: rep.pdf_filename })}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" /> View PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
