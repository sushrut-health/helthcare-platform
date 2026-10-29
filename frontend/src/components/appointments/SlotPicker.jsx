import React from 'react';
import { Sun, CloudSun, Moon, Check } from 'lucide-react';

export default function SlotPicker({ slots = [], selectedSlot, onSelectSlot }) {
  const morningSlots = slots.filter(s => s.period === 'morning');
  const afternoonSlots = slots.filter(s => s.period === 'afternoon');
  const eveningSlots = slots.filter(s => s.period === 'evening');

  const renderSection = (title, icon, slotList) => {
    if (slotList.length === 0) return null;
    const Icon = icon;

    return (
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
          <Icon className="w-4 h-4 text-amber-500" />
          <span>{title} ({slotList.filter(s => s.available).length} available)</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {slotList.map((slot) => {
            const isSelected = selectedSlot === slot.time;
            const isBooked = !slot.available;

            let btnStyle = 'bg-white hover:border-primary border-slate-200 text-slate-700 shadow-sm';
            if (isBooked) {
              btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through opacity-60';
            } else if (isSelected) {
              btnStyle = 'bg-primary border-primary text-white shadow-md font-bold scale-[1.03]';
            }

            return (
              <button
                key={slot.time}
                type="button"
                disabled={isBooked}
                onClick={() => onSelectSlot(slot.time)}
                className={`py-2 px-2 rounded-lg border text-xs text-center flex flex-col items-center justify-center transition-all ${btnStyle}`}
              >
                <span className="font-semibold">{slot.time}</span>
                <span className="text-[10px] opacity-75">{isBooked ? 'Booked' : isSelected ? 'Selected' : '15m'}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
        No consultation slots available for the selected date. Please choose another date.
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 text-xs text-slate-500">
        <span>Select an exclusive 15-minute consultation window:</span>
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-white border border-slate-300"></span> Available</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-primary"></span> Selected</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-200"></span> Booked</span>
        </div>
      </div>

      {renderSection('Morning Slots', Sun, morningSlots)}
      {renderSection('Afternoon Slots', CloudSun, afternoonSlots)}
      {renderSection('Evening Slots', Moon, eveningSlots)}
    </div>
  );
}
