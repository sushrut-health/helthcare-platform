import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { TestTube2, Building, Home, Calendar, Clock, MapPin, IndianRupee, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function BookLabTestsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form selections
  const [selectedTestId, setSelectedTestId] = useState(searchParams.get('testId') || '');
  const [selectedLabId, setSelectedLabId] = useState(searchParams.get('labId') || '');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('Morning 8:00 AM - 10:00 AM');
  const [collectionType, setCollectionType] = useState('lab_visit'); // 'lab_visit' or 'home_collection'
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    async function loadTestsAndLabs() {
      try {
        setLoading(true);
        const [tstRes, labRes] = await Promise.all([
          api.get('/directory/tests'),
          api.get('/directory/laboratories')
        ]);
        if (tstRes.success) {
          setTests(tstRes.tests);
          if (!selectedTestId && tstRes.tests.length > 0) {
            setSelectedTestId(tstRes.tests[0].id);
          }
        }
        if (labRes.success) {
          setLaboratories(res => labRes.laboratories);
          if (!selectedLabId && labRes.laboratories.length > 0) {
            setSelectedLabId(labRes.laboratories[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load tests & laboratories', err);
      } finally {
        setLoading(false);
      }
    }
    loadTestsAndLabs();
  }, []);

  const selectedTest = tests.find(t => t.id === selectedTestId);
  const selectedLab = laboratories.find(l => l.id === selectedLabId);

  const testPrice = selectedTest?.default_price || 500;
  const homeFee = (collectionType === 'home_collection' && selectedLab?.provides_home_collection) ? (selectedLab.home_collection_fee || 100) : 0;
  const totalAmount = testPrice + homeFee;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedTestId || !selectedLabId) {
      setError('Please select both a test and an accredited laboratory center.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/laboratory-bookings', {
        testId: selectedTestId,
        labId: selectedLabId,
        date: bookingDate,
        timeSlot,
        collectionType,
        address: collectionType === 'home_collection' ? address : selectedLab.address,
        city
      });

      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit test booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading diagnostic tests & pathology laboratories..." />;

  if (confirmedBooking) {
    return (
      <div className="card p-8 bg-white border border-teal-200 shadow-xl max-w-xl mx-auto text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Booking Committed</span>
        <h2 className="text-2xl font-bold text-slate-900">Diagnostic Test Scheduled!</h2>
        <p className="text-xs text-slate-500">
          Booking Reference: <strong className="font-mono text-primary">{confirmedBooking.booking_id}</strong>
        </p>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Diagnostic Test</span>
            <strong className="text-slate-900 text-sm block">{selectedTest?.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Laboratory Partner</span>
            <strong className="text-slate-900 block">{selectedLab?.name}</strong>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <span>{confirmedBooking.booking_date} ({confirmedBooking.preferred_time_slot})</span>
            <strong className="text-primary text-sm">₹{confirmedBooking.total_amount}</strong>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/patient/laboratory-reports" className="btn-primary text-xs py-2 px-4">
            View Diagnostic Reports
          </Link>
          <Link to="/patient/dashboard" className="btn-secondary text-xs py-2 px-4">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Pathology Orders</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Order Diagnostic Blood Tests & Profiles</h1>
        <p className="text-xs text-slate-500">Schedule at a partner laboratory or choose home phlebotomy sample pickup</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitBooking} className="space-y-6 text-xs">
        {/* Step 1: Select Test */}
        <div className="card p-6 bg-white border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <TestTube2 className="w-4 h-4 text-primary" />
            <span>1. Select Diagnostic Test / Health Package</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tests.map(t => {
              const isSelected = selectedTestId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTestId(t.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-primary bg-teal-50/70 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <strong className="text-slate-900 font-bold block">{t.name}</strong>
                    <span className="font-extrabold text-primary flex items-center text-sm">
                      ₹{t.default_price}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] line-clamp-2 mb-2">{t.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">{t.sample_type}</span>
                    <span>&bull; Turnaround: {t.turnaround_time_hours}h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Laboratory Center */}
        <div className="card p-6 bg-white border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-primary" />
            <span>2. Select Processing Laboratory</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {laboratories.map(lab => {
              const isSelected = selectedLabId === lab.id;
              return (
                <div
                  key={lab.id}
                  onClick={() => setSelectedLabId(lab.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-primary bg-teal-50/70 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <strong className="text-slate-900 font-bold">{lab.name}</strong>
                    {lab.provides_home_collection && (
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                        Home Pickup
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px] mb-2">{lab.address}, {lab.city}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> NABL Verified
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Collection Method & Address */}
        <div className="card p-6 bg-white border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
            <span>3. Choose Sample Collection Method & Date</span>
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCollectionType('lab_visit')}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${collectionType === 'lab_visit' ? 'border-primary bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 bg-white text-slate-700'}`}
              >
                <Building className="w-4 h-4 text-primary" />
                <div>
                  <span className="block">Visit Center in Person</span>
                  <span className="text-[10px] text-slate-500 font-normal">No additional pickup fee</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCollectionType('home_collection')}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${collectionType === 'home_collection' ? 'border-primary bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 bg-white text-slate-700'}`}
              >
                <Home className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="block">Home Phlebotomy Pickup</span>
                  <span className="text-[10px] text-slate-500 font-normal">Convenient sample draw at home</span>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Collection Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Time Window</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary bg-white"
                >
                  <option value="Early Morning 7:00 AM - 9:00 AM (Fasting Preferred)">Early Morning 7:00 AM - 9:00 AM (Fasting)</option>
                  <option value="Morning 9:00 AM - 11:00 AM">Morning 9:00 AM - 11:00 AM</option>
                  <option value="Afternoon 12:00 PM - 3:00 PM">Afternoon 12:00 PM - 3:00 PM</option>
                  <option value="Evening 4:00 PM - 7:00 PM">Evening 4:00 PM - 7:00 PM</option>
                </select>
              </div>
            </div>

            {collectionType === 'home_collection' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Home Collection Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, building, street address..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
                />
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Cost & Order CTA */}
        <div className="card p-6 bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-teal-700 uppercase">Billing Summary</span>
            <div className="flex items-center gap-3 mt-1 text-sm font-extrabold text-slate-900">
              <span>Test Fee: ₹{testPrice}</span>
              {homeFee > 0 && <span>+ Home Pickup: ₹{homeFee}</span>}
              <span>&bull; Total: <strong className="text-primary">₹{totalAmount}</strong></span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">Pay upon sample collection. Certified PDF delivered to your vault.</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary py-3 px-6 text-xs font-bold shadow-md flex items-center gap-2 whitespace-nowrap"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scheduling Order...</span>
              </>
            ) : (
              <>
                <span>Confirm Diagnostic Booking</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
