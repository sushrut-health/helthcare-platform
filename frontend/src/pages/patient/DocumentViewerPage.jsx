import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, Download, Printer, ZoomIn, ZoomOut, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export default function DocumentViewerPage() {
  const { documentId } = useParams();
  const [blobUrl, setBlobUrl] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    let isMounted = true;
    async function fetchDocument() {
      try {
        setLoading(true);
        setError(null);
        // Fetch metadata
        const metaRes = await api.get(`/documents/${documentId}/metadata`);
        if (metaRes.success && isMounted) {
          setMetadata(metaRes.document);
        }

        // Fetch secure blob
        const blob = await api.get(`/documents/${documentId}`, { responseType: 'blob' });
        const url = URL.createObjectURL(blob);
        if (isMounted) {
          setBlobUrl(url);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Authorization failed. Document access is restricted.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDocument();

    return () => {
      isMounted = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [documentId]);

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = metadata?.filename || `medical_document_${documentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (!blobUrl) return;
    const printWindow = window.open(blobUrl);
    if (printWindow) {
      printWindow.focus();
      printWindow.print();
    }
  };

  if (loading) return <LoadingSpinner message="Verifying gatekeeper credentials & streaming PDF document..." />;

  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Access Restricted</h2>
        <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
        <Link to="/patient/medical-records" className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Medical Vault
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/patient/medical-records" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Vault
        </Link>
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-mono text-slate-500 text-[11px]">{metadata?.filename}</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Digitally Verified
          </span>
        </div>
      </div>

      <div className="card p-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
        {/* PDF Controls */}
        <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-semibold">{metadata?.filename || 'Medical Document Viewer'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs mr-2">
              <button
                onClick={() => setZoom(z => Math.max(z - 15, 60))}
                className="p-1 hover:bg-slate-700 text-slate-300 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-slate-300">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(z + 15, 180))}
                className="p-1 hover:bg-slate-700 text-slate-300 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm"
              title="Download Certified Copy"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Embedded Document Frame */}
        <div className="bg-slate-100 p-6 flex justify-center min-h-[650px] overflow-auto">
          {blobUrl && (
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-150 w-full max-w-3xl"
            >
              <iframe
                src={`${blobUrl}#toolbar=0`}
                title="Certified Medical Record PDF"
                className="w-full h-[750px] bg-white shadow-xl rounded-xl border border-slate-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
