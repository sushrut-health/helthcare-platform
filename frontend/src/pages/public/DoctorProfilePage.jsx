import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SlotPicker from '../../components/appointments/SlotPicker';
import {
  Star,
  MapPin,
  Building,
  Calendar,
  ShieldCheck,
  Award,
  Clock,
  IndianRupee,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function DoctorProfilePage() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [slotsData, setSlotsData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctor() {
      try {
        setLoading(true);
        const [docRes, slotRes] = await Promise.all([
          api.get(`/directory/doctors/${doctorId}`),
          api.get(`/directory/doctors/${doctorId}/slots?date=${selectedDate}`)
        ]);
        if (docRes.success) {
          setDoctor(docRes.doctor);
          setReviews(docRes.reviews || []);
        }
        if (slotRes.success) {
          setSlotsData(slotRes.data);
        }
      } catch (err) {
        console.error('Failed to load doctor profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [doctorId, selectedDate]);

  if (loading) return <LoadingSpinner message="Loading doctor profile..." />;
  if (!doctor) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">Doctor Profile Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-4">The requested doctor is either not registered or pending administrative verification.</p>
        <Link to="/doctors" className="btn-primary text-xs py-2 px-4">Return to Doctor Directory</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Doctor Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card */}
          <div className="card p-6 bg-white border border-slate-200">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-primary flex items-center justify-center font-bold text-2xl shadow-sm">
                  {doctor.full_name?.replace('Dr. ', '')[0] || 'D'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{doctor.full_name}</h1>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
                    </span>
                  </div>
                  <p className="text-sm text-primary font-semibold mt-0.5">{doctor.specialty_name}</p>
                  <p className="text-xs text-slate-500">{doctor.qualifications}</p>
                </div>
              </div>

              {/* Rating Box */}
              <div className="bg-amber-50 text-amber-900 border border-amber-200/80 px-3.5 py-1.5 rounded-xl flex items-center space-x-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <div>
                  <span className="font-extrabold text-base leading-none block">{doctor.rating_avg || 9.5}</span>
                  <span className="text-[10px] text-amber-700 font-semibold block">out of 10 ({reviews.length} reviews)</span>
                </div>
              </div>
            </div>

            {/* Quick Stat Pill Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Experience</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-teal-600" />
                  {doctor.experience_years} Years
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Consultation Fee</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
                  ₹{doctor.consultation_fee}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Registration No</span>
                <span className="font-mono text-slate-700 font-semibold block mt-0.5 truncate" title={doctor.registration_number}>
                  {doctor.registration_number}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Slot Duration</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  15 Minutes
                </span>
              </div>
            </div>

            {/* Professional Introduction */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Professional Biography & Expertise</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                {doctor.bio}
              </p>
            </div>

            {/* Clinic Details */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Practice Location</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-start space-x-3 text-xs text-slate-700">
                <Building className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">{doctor.clinic_name}</strong>
                  <span className="text-slate-500 block">{doctor.clinic_address}, {doctor.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Reviews Section */}
          <div className="card p-6 bg-white border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Verified Patient Reviews</h3>
              <span className="text-xs text-slate-400">{reviews.length} total patient ratings</span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500">No patient reviews submitted yet for completed appointments.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-800">{rev.patient_name || 'Verified Patient'}</span>
                      <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {rev.rating}/10
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rev.review_text}</p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      Consultation Date: {rev.created_at?.split('T')[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Schedule & Booking CTA */}
        <div className="space-y-6">
          <div className="card p-6 bg-white border border-teal-200 shadow-md sticky top-24">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Consultation Scheduling</h3>
              <span className="text-xs font-bold text-primary">₹{doctor.consultation_fee}</span>
            </div>

            {/* Date Selector */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Select Consultation Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary font-medium"
              />
            </div>

            {/* Slot Preview */}
            <div className="mb-6">
              <SlotPicker
                slots={slotsData?.slots || []}
                selectedSlot={null}
                onSelectSlot={() => {}}
              />
            </div>

            <Link
              to={`/patient/appointments/book/${doctor.id}?date=${selectedDate}`}
              className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <span>Proceed to 15-Min Slot Booking</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Medical Privacy Callout */}
            <div className="mt-4 p-3 bg-teal-50/60 rounded-xl border border-teal-200/60 flex items-start space-x-2 text-[11px] text-teal-800">
              <Lock className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Zero Pre-Consultation Exposure:</strong> Dr. {doctor.full_name?.split(' ')[1]} cannot view your private medical history until you explicitly grant access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
