import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return null;
  const s = String(status).toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['confirmed', 'approved', 'active', 'completed', 'normal'].includes(s)) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['pending', 'processing', 'sample_collected'].includes(s)) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['cancelled', 'rejected', 'revoked', 'expired', 'critical'].includes(s)) {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['in_person', 'lab_visit'].includes(s)) {
    styles = 'bg-teal-50 text-teal-700 border-teal-200';
  } else if (['home_collection', 'video'].includes(s)) {
    styles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} capitalize`}>
      {status}
    </span>
  );
}
