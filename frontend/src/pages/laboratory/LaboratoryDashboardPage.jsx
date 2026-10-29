import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import {
  TestTube2,
  Calendar,
  Building,
  UploadCloud,
  FileCheck2,
  Clock,
  Home,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function LaboratoryDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await api.get('/laboratories/dashboard');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load lab dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading laboratory operational dashboard..." />;
  if (!data) return <p className="text-sm text-slate-500">Failed to load dashboard data.</p>;

  const { laboratory, stats, recentBookings, recentReports } = data;

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-teal-300 text-xs font-semibold uppercase tracking-wider">Diagnostic Center Portal</span>
              <span className="font-mono text-[11px] bg-teal-500/20 text-teal-200 px-2 py-0.5 rounded border border-teal-500/30">
                {laboratory.lab_id}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> NABL Verified
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{laboratory.name}</h1>
            <p className="text-xs text-slate-300 mt-1">
              {laboratory.address}, {laboratory.city} &bull; Accr: {laboratory.nabl_accreditation_number}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              to="/laboratory/reports/upload"
              className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Certified Report</span>
            </Link>
            <Link
              to="/laboratory/bookings"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold backdrop-blur-sm border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Bookings Queue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Orders</span>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.totalBookingsCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Diagnostic test orders</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Samples</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.pendingCollectionsCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting phlebotomy/intake</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Reports Delivered</span>
            <FileCheck2 className="w-5 h-5 text-teal-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.totalReportsUploadedCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Certified PDFs uploaded</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200/90">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Sample Collection</span>
            <Home className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">
            {laboratory.provides_home_collection ? 'Home & Center' : 'Center Only'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">₹{laboratory.home_collection_fee} pickup fee</span>
        </div>
      </div>

      {/* 3. Recent Bookings Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Recent Test Bookings</span>
            </h2>
            <Link to="/laboratory/bookings" className="text-xs font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No test orders currently received.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((bk) => (
                <div key={bk.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">{bk.patient_name}</strong>
                      <span className="font-mono text-[10px] text-slate-400">{bk.booking_id}</span>
                      <StatusBadge status={bk.status} />
                    </div>
                    <span className="text-primary font-semibold text-[11px] block mt-0.5">{bk.test_name}</span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">
                      Date: {bk.booking_date} ({bk.preferred_time_slot}) &bull; {bk.collection_type.replace('_', ' ')}
                    </span>
                  </div>

                  <Link
                    to={`/laboratory/bookings/${bk.id}`}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Recent Reports Uploaded */}
        <div className="card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              <span>Recently Uploaded Reports</span>
            </h2>
            <Link to="/laboratory/reports" className="text-xs font-semibold text-primary hover:underline">
              History
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No reports uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentReports.map((rep) => (
                <div key={rep.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">{rep.report_title}</strong>
                      <StatusBadge status={rep.status} />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 block mt-0.5">{rep.pdf_filename}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Patient ID: {rep.patient_unique_id} &bull; {rep.report_date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
