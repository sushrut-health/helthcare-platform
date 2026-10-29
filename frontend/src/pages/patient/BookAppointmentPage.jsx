import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import SlotPicker from '../../components/appointments/SlotPicker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Calendar,
  Clock,
  IndianRupee,
  Building,
  User,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [slotsData, setSlotsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [consultationType, setConsultationType] = useState('in_person');
  const [symptoms, setSymptoms] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDoctorAndSlots() {
      try {
        setLoading(true);
        setError(null);
        const [docRes, slotRes] = await Promise.all([
          api.get(`/directory/doctors/${doctorId}`),
          api.get(`/directory/doctors/${doctorId}/slots?date=${selectedDate}`)
        ]);
        if (docRes.success) setDoctor(docRes.doctor);
        if (slotRes.success) {
          setSlotsData(slotRes.data);
          // Auto select first available slot if not selected
          const firstAvail = slotRes.data?.slots?.find(s => s.available);
          if (firstAvail && !selectedSlot) setSelectedSlot(firstAvail.time);
        }
      } catch (err) {
        console.error('Failed to load slots', err);
        setError('Failed to load doctor slot schedule.');
      } finally {
        setLoading(false);
      }
    }
    loadDoctorAndSlots();
  }, [doctorId, selectedDate]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError('Please select an available 15-minute consultation time slot.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/patients/appointments/book', {
        doctorId,
        date: selectedDate,
        startTime: selectedSlot,
        consultationType,
        symptoms
      });

      if (res.success && res.appointment) {
        navigate(`/patient/appointments/confirmation/${res.appointment.id}`);
      }
    } catch (err) {
      // Handles concurrency slot conflict or error
      setError(err.message || 'Double booking error. The chosen slot was just taken by another patient. Please select another slot.');
      // Refresh slots
      const slotRes = await api.get(`/directory/doctors/${doctorId}/slots?date=${selectedDate}`);
      if (slotRes.success) setSlotsData(slotRes.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving real-time doctor slot schedule..." />;
  if (!doctor) return <p className="text-sm text-slate-500">Doctor not found.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Book Consultation</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Schedule 15-Minute Slot with {doctor.full_name}</h1>
        <p className="text-xs text-slate-500">{doctor.specialty_name} &bull; {doctor.clinic_name}</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleBookingSubmit} className="space-y-6">
        {/* Step 1: Choose Date */}
        <div className="card p-6 bg-white border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>1. Choose Consultation Date</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Appointment Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary font-medium"
              />
            </div>
            <div className="sm:col-span-2 flex items-center text-xs text-slate-500">
              <span className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 block w-full">
                Consultation slots are guaranteed 15-minute exclusive windows.
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Choose Slot */}
        <div className="card p-6 bg-white border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>2. Select 15-Minute Time Slot</span>
          </h2>

          <SlotPicker
            slots={slotsData?.slots || []}
            selectedSlot={selectedSlot}
            onSelectSlot={(slotTime) => setSelectedSlot(slotTime)}
          />
        </div>

        {/* Step 3: Consultation Details */}
        <div className="card p-6 bg-white border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building className="w-4 h-4 text-primary" />
            <span>3. Consultation Mode & Symptoms</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Consultation Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultationType('in_person')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${consultationType === 'in_person' ? 'border-primary bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  <Building className="w-4 h-4 text-primary" />
                  <div>
                    <span className="block text-xs">In-Person Clinic Visit</span>
                    <span className="text-[10px] text-slate-500 font-normal">{doctor.clinic_name}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('video')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${consultationType === 'video' ? 'border-primary bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="block text-xs">Telehealth Video Call</span>
                    <span className="text-[10px] text-slate-500 font-normal">Encrypted video room link</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Reason for Visit or Primary Symptoms (Optional)
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your health symptoms, e.g. persistent headaches or regular quarterly checkup..."
                className="w-full p-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Summary & Submit */}
        <div className="card p-6 bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-teal-700 uppercase">Booking Summary</span>
            <div className="flex items-center gap-3 mt-1 text-sm font-extrabold text-slate-900">
              <span>{selectedDate} &bull; {selectedSlot || 'Select a slot'}</span>
              <span>&bull;</span>
              <span className="flex items-center text-primary">₹{doctor.consultation_fee}</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Pay at clinic or during consultation. Double-booking prevention active.
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedSlot}
            className="btn-primary py-3 px-6 text-xs font-bold shadow-md flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reserving Slot...</span>
              </>
            ) : (
              <>
                <span>Confirm & Lock Appointment Slot</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
