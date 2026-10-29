import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import DoctorCard from '../../components/doctors/DoctorCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Search, MapPin, Filter, Star, Stethoscope, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FindDoctorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'fee_low', 'fee_high'

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [docRes, specRes] = await Promise.all([
          api.get(`/directory/doctors?query=${encodeURIComponent(query)}&specialty=${encodeURIComponent(selectedSpecialty)}&location=${encodeURIComponent(location)}&minRating=${encodeURIComponent(minRating)}`),
          api.get('/directory/specialties')
        ]);
        if (docRes.success) setDoctors(docRes.doctors);
        if (specRes.success) setSpecialties(specRes.specialties);
      } catch (err) {
        console.error('Failed to load doctors', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [query, selectedSpecialty, location, minRating]);

  // Sort logic
  const sortedDoctors = [...doctors].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating_avg || 0) - (a.rating_avg || 0);
    if (sortBy === 'fee_low') return a.consultation_fee - b.consultation_fee;
    if (sortBy === 'fee_high') return b.consultation_fee - a.consultation_fee;
    return 0;
  });

  const handleResetFilters = () => {
    setQuery('');
    setSelectedSpecialty('');
    setLocation('');
    setMinRating('');
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Doctor Directory</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Find Verified Doctors & Book Appointments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Browse vetted medical practitioners, check live 15-minute slot schedules, and consult in-clinic or virtually.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="card p-5 mb-8 bg-white shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Query Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Doctor, clinic, qualification..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Specialty Dropdown */}
          <div className="relative">
            <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-primary bg-white capitalize"
            >
              <option value="">All Specialties</option>
              {specialties.map(s => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="City or locality, e.g. Bandra"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Minimum Rating */}
          <div className="relative">
            <Star className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-primary bg-white"
            >
              <option value="">Any Rating</option>
              <option value="9.0">9.0+ / 10</option>
              <option value="9.5">9.5+ / 10 (Top Rated)</option>
              <option value="9.8">9.8+ / 10 (Exceptional)</option>
            </select>
          </div>
        </div>

        {/* Bottom Sorting & Clear Controls */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${sortBy === 'rating' ? 'bg-teal-50 text-primary border border-teal-200' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Highest Rated
            </button>
            <button
              onClick={() => setSortBy('fee_low')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${sortBy === 'fee_low' ? 'bg-teal-50 text-primary border border-teal-200' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Fee: Low to High
            </button>
            <button
              onClick={() => setSortBy('fee_high')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${sortBy === 'fee_high' ? 'bg-teal-50 text-primary border border-teal-200' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Fee: High to Low
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-500 font-semibold">
              Showing {sortedDoctors.length} approved doctors
            </span>
            <button
              onClick={handleResetFilters}
              className="text-primary hover:text-primary-dark font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <LoadingSpinner message="Searching verified doctor directory..." />
      ) : sortedDoctors.length === 0 ? (
        <EmptyState
          title="No doctors found"
          message="No doctors match your selected filters. Try broadening your specialty or location search."
          action={
            <button onClick={handleResetFilters} className="btn-primary text-xs py-1.5 px-3">
              Clear All Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
