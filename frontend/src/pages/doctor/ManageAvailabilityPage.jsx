import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Clock, Calendar, CheckCircle2, Save, Plus, Trash2, AlertCircle } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ManageAvailabilityPage() {
  const [rules, setRules] = useState([]);
  const [slotDuration, setSlotDuration] = useState(15);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadAvailability() {
      try {
        setLoading(true);
        const res = await api.get('/doctors/availability');
        if (res.success && res.availability) {
          setRules(res.availability.map(r => ({
            dayOfWeek: r.day_of_week,
            startTime: r.start_time.slice(0, 5),
            endTime: r.end_time.slice(0, 5),
            slotDurationMinutes: r.slot_duration_minutes || 15,
            isActive: r.is_active
          })));
        }
      } catch (err) {
        console.error('Failed to load availability', err);
      } finally {
        setLoading(false);
      }
    }
    loadAvailability();
  }, []);

  const handleAddRule = (dayIndex) => {
    setRules([
      ...rules,
      {
        dayOfWeek: dayIndex,
        startTime: '10:00',
        endTime: '13:00',
        slotDurationMinutes: slotDuration,
        isActive: true
      }
    ]);
  };

  const handleRemoveRule = (index) => {
    setRules(rules.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.put('/doctors/availability', { rules });
      if (res.success) {
        setMessage('Weekly consultation hours and 15-minute slot engine updated successfully.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading availability engine rules..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Slot Generator</span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Manage Weekly Consultation Hours</h1>
          <p className="text-xs text-slate-500">Configure working intervals and 15-minute appointment duration</p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Global Slot Duration */}
        <div className="card p-5 bg-white border border-slate-200 flex items-center justify-between">
          <div>
            <strong className="text-slate-900 text-sm block">Default Consultation Window</strong>
            <span className="text-slate-500">Duration of each exclusive bookable slot</span>
          </div>
          <div className="flex items-center space-x-2">
            {[10, 15, 20, 30].map(dur => (
              <button
                key={dur}
                type="button"
                onClick={() => setSlotDuration(dur)}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${slotDuration === dur ? 'bg-primary text-white border-primary shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              >
                {dur} Mins
              </button>
            ))}
          </div>
        </div>

        {/* Days Configuration */}
        <div className="card p-6 bg-white border border-slate-200 space-y-5">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Weekly Schedule Intervals</span>
          </h2>

          <div className="space-y-4">
            {DAYS.map((dayName, dayIndex) => {
              const dayRules = rules
                .map((r, idx) => ({ ...r, originalIndex: idx }))
                .filter(r => r.dayOfWeek === dayIndex);

              return (
                <div key={dayIndex} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-slate-800 font-bold">{dayName}</strong>
                    <button
                      type="button"
                      onClick={() => handleAddRule(dayIndex)}
                      className="text-primary hover:text-primary-dark font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Interval
                    </button>
                  </div>

                  {dayRules.length === 0 ? (
                    <span className="text-slate-400 italic text-[11px]">Unavailable on {dayName}</span>
                  ) : (
                    <div className="space-y-2">
                      {dayRules.map(r => (
                        <div key={r.originalIndex} className="flex items-center space-x-3 bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-medium">Session:</span>
                          <input
                            type="time"
                            value={r.startTime}
                            onChange={(e) => {
                              const updated = [...rules];
                              updated[r.originalIndex].startTime = e.target.value;
                              setRules(updated);
                            }}
                            className="px-2 py-1 rounded border border-slate-200 font-mono text-xs"
                          />
                          <span className="text-slate-400">to</span>
                          <input
                            type="time"
                            value={r.endTime}
                            onChange={(e) => {
                              const updated = [...rules];
                              updated[r.originalIndex].endTime = e.target.value;
                              setRules(updated);
                            }}
                            className="px-2 py-1 rounded border border-slate-200 font-mono text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveRule(r.originalIndex)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Remove session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Publishing Schedule...' : 'Save Availability Engine Rules'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
