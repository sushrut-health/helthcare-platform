import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SlotPicker from '../../components/appointments/SlotPicker';
import { Star, MapPin, Building, Award, Clock, IndianRupee, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

export default function PatientDoctorDetailsPage() {
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
        console.error('Failed to load doctor profile in patient portal', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [doctorId, selectedDate]);

  if (loading) return <LoadingSpinner message="Loading doctor details..." />;
  if (!doctor) return <p className="text-sm text-slate-500">Doctor not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Doctor Profile</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{doctor.full_name}</h1>
          <p className="text-xs text-slate-500">{doctor.specialty_name} &bull; {doctor.clinic_name}</p>
        </div>
        <Link
          to={`/patient/appointments/book/${doctor.id}?date=${selectedDate}`}
          className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-1.5"
        >
          <span>Book Appointment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 bg-white border border-slate-200">
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-primary font-bold">{doctor.specialty_name}</span>
                <p className="text-xs text-slate-500">{doctor.qualifications}</p>
              </div>
              <div className="flex items-center space-x-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-xl text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{doctor.rating_avg} / 10</span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-sm">About the Doctor</h3>
                <p className="leading-relaxed font-light">{doctor.bio}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block">Experience</span>
                  <strong className="text-slate-800">{doctor.experience_years} Years</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Consultation Fee</span>
                  <strong className="text-slate-800 flex items-center">₹{doctor.consultation_fee}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Medical Reg No</span>
                  <strong className="text-slate-800 font-mono">{doctor.registration_number}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-400 block mb-1">Clinic Address</span>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{doctor.clinic_address}, {doctor.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Reviews */}
          <div className="card p-6 bg-white border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Patient Consultation Feedback ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500">No reviews recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-slate-800">{r.patient_name}</strong>
                      <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {r.rating}/10
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{r.review_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Slot Schedule */}
        <div className="space-y-6">
          <div className="card p-6 bg-white border border-teal-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Select Date & View Slots</h3>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs mb-4 focus:outline-none focus:border-primary"
            />
            <SlotPicker
              slots={slotsData?.slots || []}
              selectedSlot={null}
              onSelectSlot={() => {}}
            />
            <Link
              to={`/patient/appointments/book/${doctor.id}?date=${selectedDate}`}
              className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2 mt-4 shadow-sm"
            >
              <span>Book Appointment For This Date</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
