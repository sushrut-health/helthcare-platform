import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { TestTube2, Building, Home, MapPin, Calendar, Clock, ArrowLeft, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function LaboratoryBookingDetailsPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const res = await api.get('/laboratories/bookings');
      if (res.success) {
        const bk = res.bookings.find(b => b.id === bookingId || b.booking_id === bookingId);
        setBooking(bk);
      }
    } catch (err) {
      console.error('Failed to load booking details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const handleUpdateStatus = async (status) => {
    try {
      await api.patch(`/laboratories/bookings/${booking.id}/status`, { status });
      await loadBooking();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  if (loading) return <LoadingSpinner message="Loading booking details..." />;
  if (!booking) return <p className="text-sm text-slate-500">Booking record not found.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/laboratory/bookings" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Test Bookings
      </Link>

      <div className="card p-6 bg-white border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {booking.booking_id}
              </span>
              <StatusBadge status={booking.status} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">{booking.test_name}</h1>
            <p className="text-xs text-slate-500">Ordered for patient {booking.patient_name}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Amount</span>
            <span className="text-lg font-bold text-slate-900">₹{booking.total_amount}</span>
          </div>
        </div>

        {/* Minimum Required Patient Logistics (Privacy Preserved) */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3 mb-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Sample Collection Details (Minimal Access Authorization)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
            <div>
              <span className="text-slate-400 block text-[11px]">Collection Method:</span>
              <strong className="capitalize">{booking.collection_type.replace('_', ' ')}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Scheduled Slot:</span>
              <strong>{booking.booking_date} ({booking.preferred_time_slot})</strong>
            </div>
          </div>

          {booking.collection_address && (
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 block text-[11px]">Collection Address:</span>
              <span className="font-medium text-slate-800">{booking.collection_address}, {booking.collection_city}</span>
            </div>
          )}
        </div>

        {/* Status Transition Control Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Update Status:</span>
            {booking.status === 'confirmed' && (
              <button
                onClick={() => handleUpdateStatus('sample_collected')}
                className="btn-primary text-xs py-1.5 px-3 bg-amber-600 hover:bg-amber-700"
              >
                Mark Sample Collected
              </button>
            )}
            {booking.status === 'sample_collected' && (
              <button
                onClick={() => handleUpdateStatus('processing')}
                className="btn-primary text-xs py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700"
              >
                Mark Processing in Lab
              </button>
            )}
            {booking.status === 'processing' && (
              <button
                onClick={() => handleUpdateStatus('completed')}
                className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700"
              >
                Mark Completed
              </button>
            )}
          </div>

          <Link
            to={`/laboratory/reports/upload?bookingId=${booking.id}&patientId=${booking.patient_id}&testId=${booking.test_id}`}
            className="btn-primary text-xs py-1.5 px-3.5 shadow-sm flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Certified Report PDF</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
