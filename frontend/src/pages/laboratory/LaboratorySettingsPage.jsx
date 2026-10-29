import React, { useState } from 'react';
import { Settings, Shield, Bell, KeyRound, CheckCircle2 } from 'lucide-react';

export default function LaboratorySettingsPage() {
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [autoSms, setAutoSms] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Facility Preferences</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Laboratory Operational Settings</h1>
        <p className="text-xs text-slate-500">Configure notification alerts, integration webhooks, and security</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Operational settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <div className="card p-6 bg-white border border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span>Order Dispatch & Notification Preferences</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <strong className="text-slate-800 block">Email Alerts for New Home Collection Orders</strong>
                <span className="text-slate-500 text-[11px]">Receive instantaneous dispatch notification when patient schedules pickup</span>
              </div>
              <input
                type="checkbox"
                checked={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.checked)}
                className="rounded text-primary focus:ring-teal-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <strong className="text-slate-800 block">Automated Phlebotomy SMS Alerts</strong>
                <span className="text-slate-500 text-[11px]">Send tracking updates to patient when phlebotomist is en-route</span>
              </div>
              <input
                type="checkbox"
                checked={autoSms}
                onChange={(e) => setAutoSms(e.target.checked)}
                className="rounded text-primary focus:ring-teal-500 w-4 h-4"
              />
            </label>
          </div>
        </div>

        <div className="card p-6 bg-white border border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary" />
            <span>Storage & Cryptographic Checksum Compliance</span>
          </h2>
          <p className="text-slate-600 text-xs leading-relaxed">
            All reports uploaded are checksum-verified with SHA-256 before delivery to the patient vault. External file storage provider is currently configured to <strong className="text-slate-800">Local Secured Filesystem</strong> (dev mode).
          </p>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary py-2.5 px-6 text-xs font-bold shadow-sm">
            Save Operational Settings
          </button>
        </div>
      </form>
    </div>
  );
}
