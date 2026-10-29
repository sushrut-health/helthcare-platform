import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import {
  ShieldAlert,
  Users,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ScrollText
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdmin() {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdmin();
  }, []);

  if (loading) return <LoadingSpinner message="Aggregating platform operational telemetry..." />;
  if (!data) return <p className="text-sm text-slate-500">Failed to load admin dashboard data.</p>;

  const { stats, pendingDoctors, pendingLabs, recentAuditLogs, recentAppointments } = data;

  return (
    <div className="space-y-8">
      {/* 1. Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-teal-400 text-xs font-semibold uppercase tracking-wider">Administrative Governance</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> Platform Root
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">System Operational Overview</h1>
            <p className="text-xs text-slate-300 mt-1">
              Credential review queues, platform appointment telemetry, and security audit trails
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              to="/admin/doctors/pending"
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Pending Doctors ({stats.pendingDoctorsCount})</span>
            </Link>
            <Link
              to="/admin/laboratories/pending"
              className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Pending Labs ({stats.pendingLabsCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Operational Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Registered Patients</span>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.registeredPatientsCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Active user accounts</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Doctor Verification</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-emerald-600">{stats.approvedDoctorsCount}</span>
            <span className="text-xs font-bold text-amber-600">({stats.pendingDoctorsCount} pending)</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Medical council registered</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Laboratory Centers</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-emerald-600">{stats.approvedLabsCount}</span>
            <span className="text-xs font-bold text-amber-600">({stats.pendingLabsCount} pending)</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">NABL certified network</span>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Total Consultations</span>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats.totalAppointmentsCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Committed appointments</span>
        </div>
      </div>

      {/* 3. Review Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Doctor Applications */}
        <div className="card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Doctor Verification Queue ({pendingDoctors.length})</span>
            </h2>
            <Link to="/admin/doctors/pending" className="text-xs font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>

          {pendingDoctors.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No pending doctor applications awaiting review.</p>
          ) : (
            <div className="space-y-3">
              {pendingDoctors.map(doc => (
                <div key={doc.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">{doc.full_name}</strong>
                      <span className="font-mono text-[10px] text-slate-400">{doc.doctor_id}</span>
                    </div>
                    <span className="text-primary font-semibold text-[11px] block mt-0.5">{doc.specialty_name}</span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">Reg: {doc.registration_number} &bull; {doc.qualifications}</span>
                  </div>

                  <Link
                    to={`/admin/doctors/${doc.id}/verification`}
                    className="btn-primary text-xs py-1.5 px-3 shadow-sm flex items-center gap-1"
                  >
                    <span>Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Lab Applications */}
        <div className="card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" />
              <span>Laboratory Verification Queue ({pendingLabs.length})</span>
            </h2>
            <Link to="/admin/laboratories/pending" className="text-xs font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>

          {pendingLabs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No pending laboratory applications.</p>
          ) : (
            <div className="space-y-3">
              {pendingLabs.map(lab => (
                <div key={lab.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">{lab.name}</strong>
                      <span className="font-mono text-[10px] text-slate-400">{lab.lab_id}</span>
                    </div>
                    <span className="text-slate-500 text-[11px] block mt-0.5">{lab.address}, {lab.city}</span>
                    <span className="text-slate-400 text-[10px] block mt-0.5 font-mono">NABL: {lab.nabl_accreditation_number}</span>
                  </div>

                  <Link
                    to={`/admin/laboratories/${lab.id}/verification`}
                    className="btn-primary text-xs py-1.5 px-3 shadow-sm flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Recent Audit Logs & Administrative Access Boundaries */}
      <div className="card p-6 bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-primary" />
            <span>Platform Security Audit Trail</span>
          </h2>
          <Link to="/admin/settings" className="text-xs font-semibold text-primary hover:underline">
            Complete Audit Log
          </Link>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900 block mb-1">Administrative Boundaries Enforced:</strong>
          Platform administrators manage accounts and review licensing documents, but have strictly ZERO clinical access to private patient medical histories, clinical diagnosis notes, or prescription contents.
        </div>

        <div className="space-y-2 text-xs">
          {recentAuditLogs.map(log => (
            <div key={log.id} className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold text-slate-800">{log.action}</span>
                <span className="text-slate-500 text-[11px] block">{log.resource_type}: {log.resource_id}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
