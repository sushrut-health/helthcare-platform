import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, FileUp, ArrowLeft } from 'lucide-react';

export default function UploadReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [bookingId, setBookingId] = useState(searchParams.get('bookingId') || '');
  const [patientId, setPatientId] = useState(searchParams.get('patientId') || 'PAI100001');
  const [testId, setTestId] = useState(searchParams.get('testId') || 'TST000001');
  const [reportTitle, setReportTitle] = useState('Complete Blood Count Certified Diagnostic Analysis');
  const [description, setDescription] = useState('Automated 5-part differential hematology analysis with certified pathologist validation.');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Normal'); // 'Normal', 'Abnormal', 'Critical'
  const [selectedFile, setSelectedFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedReport, setUploadedReport] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setError('Only certified PDF documents are accepted.');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('patientId', patientId);
      formData.append('testId', testId);
      if (bookingId) formData.append('bookingId', bookingId);
      formData.append('reportTitle', reportTitle);
      formData.append('description', description);
      formData.append('reportDate', reportDate);
      formData.append('status', status);

      if (selectedFile) {
        formData.append('reportPdf', selectedFile);
      }

      const res = await api.post('/laboratories/reports/upload', formData);
      if (res.success && res.report) {
        setUploadedReport(res.report);
      }
    } catch (err) {
      setError(err.message || 'Report upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (uploadedReport) {
    return (
      <div className="card p-8 bg-white border border-teal-200 shadow-xl max-w-xl mx-auto text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Upload Successful</span>
        <h2 className="text-2xl font-bold text-slate-900">Laboratory Report Published</h2>
        <p className="text-xs text-slate-500">
          Generated Specification Filename: <strong className="font-mono text-primary font-bold">{uploadedReport.pdf_filename}</strong>
        </p>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-600">
          <div><strong>Report Title:</strong> {uploadedReport.report_title}</div>
          <div><strong>Patient ID:</strong> {uploadedReport.patient_unique_id}</div>
          <div><strong>Test Code:</strong> {uploadedReport.test_unique_id}</div>
          <div><strong>Laboratory ID:</strong> {uploadedReport.lab_unique_id}</div>
          <div><strong>Report Reference:</strong> {uploadedReport.report_id}</div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/laboratory/reports" className="btn-primary text-xs py-2 px-4">
            View Uploaded Reports
          </Link>
          <Link to="/laboratory/dashboard" className="btn-secondary text-xs py-2 px-4">
            Laboratory Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/laboratory/reports" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Report History
      </Link>

      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Diagnostic Delivery</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Upload Certified Laboratory Report</h1>
        <p className="text-xs text-slate-500">
          The backend automatically generates the required specification filename: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-primary">PATIENT_ID-TEST_ID-LAB_ID-REPORT_ID.pdf</code>
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 bg-white border border-slate-200 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Patient Unique ID or UUID *</label>
            <input
              type="text"
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. PAI100001"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono font-bold text-primary focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Diagnostic Test Code or ID *</label>
            <input
              type="text"
              required
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              placeholder="e.g. TST000001"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono font-bold text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Certified Report Title *</label>
          <input
            type="text"
            required
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary font-semibold text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinical Evaluation Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary bg-white font-bold"
            >
              <option value="Normal">Normal (Within Reference Range)</option>
              <option value="Abnormal">Abnormal (Attention Needed)</option>
              <option value="Critical">Critical (Immediate Doctor Action)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Report Analysis Date *</label>
            <input
              type="date"
              required
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Clinical Finding Summary</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        {/* PDF File Upload Zone */}
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Certified Medical PDF File</label>
          <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center cursor-pointer hover:bg-slate-100/70 transition-colors">
            <input
              type="file"
              accept="application/pdf"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <FileUp className="w-8 h-8 text-primary mb-2" />
              <span className="font-semibold text-slate-800 text-xs block">
                {selectedFile ? selectedFile.name : 'Click to select or drop Certified PDF'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Maximum file size 10MB (PDF Only)'}
              </span>
            </label>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing & Verifying Storage...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload Certified Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
