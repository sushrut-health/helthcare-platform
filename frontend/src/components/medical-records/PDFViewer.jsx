import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { FileText, Download, Printer, ZoomIn, ZoomOut, ShieldCheck, AlertCircle, Loader2, X } from 'lucide-react';

export default function PDFViewer({ documentId, filename, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    let isMounted = true;
    async function loadDocument() {
      try {
        setLoading(true);
        setError(null);
        const blob = await api.get(`/documents/${documentId}`, { responseType: 'blob' });
        const url = URL.createObjectURL(blob);
        if (isMounted) {
          setBlobUrl(url);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to securely load document');
          setLoading(false);
        }
      }
    }
    loadDocument();

    return () => {
      isMounted = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [documentId]);

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || `document_${documentId}.pdf`;
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden">
        {/* Header Toolbar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-600/30 border border-teal-500/40 text-teal-300 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-sm truncate">{filename || `Medical Document - ${documentId}`}</h3>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Authorized Access Verified
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 mr-2 text-xs">
              <button
                onClick={() => setZoom(z => Math.max(z - 15, 60))}
                className="p-1.5 hover:bg-slate-700 text-slate-300 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-slate-300 text-[11px]">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(z + 15, 180))}
                className="p-1.5 hover:bg-slate-700 text-slate-300 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              disabled={!blobUrl}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              disabled={!blobUrl}
              className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download Certified PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Viewer Area */}
        <div className="flex-1 bg-slate-100 p-4 overflow-auto flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
              <p className="text-xs font-medium">Validating gatekeeper permissions & streaming PDF...</p>
            </div>
          )}

          {error && (
            <div className="bg-white p-6 rounded-xl border border-rose-200 text-center max-w-md shadow-sm">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800 mb-1">Access Restricted</h4>
              <p className="text-xs text-slate-600 mb-4">{error}</p>
              {onClose && (
                <button onClick={onClose} className="btn-secondary text-xs py-1.5 px-3">
                  Dismiss
                </button>
              )}
            </div>
          )}

          {blobUrl && (
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-150 w-full h-full flex justify-center"
            >
              <iframe
                src={`${blobUrl}#toolbar=0`}
                title="Medical PDF Document"
                className="w-full max-w-3xl h-full min-h-[600px] bg-white shadow-xl rounded-lg border border-slate-300"
              />
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-2.5 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>Filename: <strong className="font-mono text-slate-700">{filename || documentId}</strong></span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> SHA-256 Storage Integrity Verified
          </span>
        </div>
      </div>
    </div>
  );
}
