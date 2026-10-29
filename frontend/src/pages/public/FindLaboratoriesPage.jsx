import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LaboratoryCard from '../../components/laboratory/LaboratoryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Search, MapPin, TestTube2, Home, CheckCircle2, RotateCcw } from 'lucide-react';

export default function FindLaboratoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [homeCollectionOnly, setHomeCollectionOnly] = useState(searchParams.get('homeCollection') === 'true');

  useEffect(() => {
    async function loadLabs() {
      try {
        setLoading(true);
        const res = await api.get(`/directory/laboratories?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&homeCollection=${homeCollectionOnly}`);
        if (res.success) {
          setLaboratories(res.laboratories);
        }
      } catch (err) {
        console.error('Failed to load laboratories', err);
      } finally {
        setLoading(false);
      }
    }
    loadLabs();
  }, [query, location, homeCollectionOnly]);

  const handleReset = () => {
    setQuery('');
    setLocation('');
    setHomeCollectionOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Diagnostic Network</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          NABL Accredited Pathology Laboratories & Centers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Schedule diagnostic blood pathology, routine checkups, and certified digital lab reports with verified sample tracking.
        </p>
      </div>

      {/* Filter Card */}
      <div className="card p-5 mb-8 bg-white shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search diagnostic center or test offering..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Locality or city, e.g. Lower Parel"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-2 flex items-center">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={homeCollectionOnly}
                onChange={(e) => setHomeCollectionOnly(e.target.checked)}
                className="rounded text-primary focus:ring-teal-500 w-4 h-4"
              />
              <span className="flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-indigo-600" />
                Home Pickup Only
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">
            Showing {laboratories.length} certified laboratories
          </span>
          <button
            onClick={handleReset}
            className="text-primary hover:text-primary-dark font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingSpinner message="Searching accredited laboratories..." />
      ) : laboratories.length === 0 ? (
        <EmptyState
          title="No laboratories found"
          message="No diagnostic centers matched your search query. Try removing filters or searching by city."
          action={
            <button onClick={handleReset} className="btn-primary text-xs py-1.5 px-3">
              Clear Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laboratories.map((lab) => (
            <LaboratoryCard key={lab.id} lab={lab} />
          ))}
        </div>
      )}
    </div>
  );
}
