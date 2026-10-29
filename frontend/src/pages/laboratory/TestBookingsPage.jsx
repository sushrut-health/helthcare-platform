import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Home, Building, Clock, MapPin, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';

export default function TestBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/laboratories/bookings');
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load lab bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, nextStatus) => {
    try {
      await api.patch(`/laboratories/bookings/${bookingId}/status`, { status: nextStatus });
      await loadBookings();
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  const filtered = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Logistics & Intake</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Test Bookings & Sample Management</h1>
          <p className="text-xs text-slate-500">Track home sample pickup routes and update test processing lifecycles</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 text-xs">
        {['all', 'confirmed', 'sample_collected', 'processing', 'completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`pb-2.5 px-3 font-semibold border-b-2 capitalize transition-colors ${statusFilter === tab ? 'border-primary text-primary font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving laboratory bookings queue..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No bookings in this state"
          message="There are no patient diagnostic orders currently matching this status filter."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(bk => (
            <div key={bk.id} className="card p-5 bg-white border border-slate-200 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                    {bk.booking_id}
                  </span>
                  <StatusBadge status={bk.status} />
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${bk.collection_type === 'home_collection' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'}`}>
                    {bk.collection_type === 'home_collection' ? <Home className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                    {bk.collection_type.replace('_', ' ')}
                  </span>
                </div>

                <strong className="text-slate-900 font-bold text-sm block">{bk.patient_name}</strong>
                <p className="text-primary font-semibold text-xs">{bk.test_name}</p>

                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px] pt-1">
                  <span>Date: {bk.booking_date} ({bk.preferred_time_slot})</span>
                  <span>&bull; Total: ₹{bk.total_amount}</span>
                  {bk.collection_address && (
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400" /> {bk.collection_address}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                {bk.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(bk.id, 'sample_collected')}
                    className="btn-primary text-xs py-1.5 px-3 bg-amber-600 hover:bg-amber-700"
                  >
                    Mark Sample Drawn
                  </button>
                )}

                {bk.status === 'sample_collected' && (
                  <button
                    onClick={() => handleUpdateStatus(bk.id, 'processing')}
                    className="btn-primary text-xs py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700"
                  >
                    Send to Analyzer
                  </button>
                )}

                {bk.status === 'processing' && (
                  <Link
                    to={`/laboratory/reports/upload?bookingId=${bk.id}&patientId=${bk.patient_id}&testId=${bk.test_id}`}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Upload Report PDF
                  </Link>
                )}

                <Link
                  to={`/laboratory/bookings/${bk.id}`}
                  className="btn-secondary text-xs py-1.5 px-2.5"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
