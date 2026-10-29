import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import DoctorCard from '../../components/doctors/DoctorCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Search, MapPin, Stethoscope, Star, RotateCcw } from 'lucide-react';

export default function PatientDoctorSearchPage() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    async function loadDoctors() {
      try {
        setLoading(true);
        const [docRes, specRes] = await Promise.all([
          api.get(`/directory/doctors?query=${encodeURIComponent(query)}&specialty=${encodeURIComponent(selectedSpecialty)}&location=${encodeURIComponent(location)}&minRating=${encodeURIComponent(minRating)}`),
          api.get('/directory/specialties')
        ]);
        if (docRes.success) setDoctors(docRes.doctors);
        if (specRes.success) setSpecialties(specRes.specialties);
      } catch (err) {
        console.error('Failed to load doctors in patient portal', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, [query, selectedSpecialty, location, minRating]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Appointment Booking</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Search & Book Verified Doctors</h1>
        <p className="text-xs text-slate-500 mt-0.5">Filter by specialty, clinic address, and consultation fees</p>
      </div>

      {/* Specialty Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedSpecialty('')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${selectedSpecialty === '' ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
        >
          All Specialties
        </button>
        {specialties.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSpecialty(s.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${selectedSpecialty === s.slug ? 'bg-primary text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="card p-4 bg-white border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Doctor name or clinic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Area or city..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="relative">
            <Star className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary bg-white"
            >
              <option value="">Any Rating</option>
              <option value="9.0">9.0+ / 10</option>
              <option value="9.5">9.5+ / 10</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Doctors */}
      {loading ? (
        <LoadingSpinner message="Fetching doctors..." />
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No doctors found"
          message="No doctors match your query. Try resetting filters."
          action={
            <button onClick={() => { setQuery(''); setSelectedSpecialty(''); setLocation(''); }} className="btn-primary text-xs py-1.5 px-3">
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doc => (
            <DoctorCard key={doc.id} doctor={doc} bookUrlPrefix="/patient/doctors" />
          ))}
        </div>
      )}
    </div>
  );
}
