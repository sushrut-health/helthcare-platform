import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Pill, Plus, Trash2, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react';

export default function DiagnosisPrescriptionPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState('dis-001');
  const [medications, setMedications] = useState([
    { name: 'Tab Metformin', dosage: '500mg', frequency: '1-0-1', duration: '30 days', instructions: 'After food' }
  ]);
  const [dosageInstructions, setDosageInstructions] = useState('Maintain regular daily exercise and follow-up in 30 days.');
  const [followUpDate, setFollowUpDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdRx, setCreatedRx] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const aptRes = await api.get('/doctors/appointments');
        if (aptRes.success) {
          const apt = aptRes.appointments.find(a => a.id === appointmentId || a.appointment_id === appointmentId);
          setAppointment(apt);
        }

        // Standard diseases catalog
        setDiseases([
          { id: 'dis-001', code: 'E11.9', name: 'Type 2 Diabetes Mellitus' },
          { id: 'dis-002', code: 'I10', name: 'Essential (Primary) Hypertension' },
          { id: 'dis-003', code: 'J20.9', name: 'Acute Bronchitis' },
          { id: 'dis-004', code: 'L20.9', name: 'Atopic Dermatitis' },
          { id: 'dis-005', code: 'M47.8', name: 'Lumbar Spondylosis' },
          { id: 'dis-006', code: 'G43.1', name: 'Migraine with Aura' }
        ]);
      } catch (err) {
        console.error('Failed to load consultation context', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [appointmentId]);

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { name: '', dosage: '', frequency: '1-0-1', duration: '7 days', instructions: 'After food' }
    ]);
  };

  const handleRemoveMedication = (index) => {
    setMedications(medications.filter((_, idx) => idx !== index));
  };

  const handleUpdateMed = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/doctors/prescriptions', {
        appointmentId: appointment.id,
        patientId: appointment.patient_id,
        diseaseId: selectedDiseaseId,
        medications,
        dosageInstructions,
        followUpDate
      });

      if (res.success && res.prescription) {
        setCreatedRx(res.prescription);
      }
    } catch (err) {
      setError(err.message || 'Prescription generation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Opening clinical prescription workspace..." />;
  if (!appointment) return <p className="text-sm text-slate-500">Appointment not found.</p>;

  if (createdRx) {
    return (
      <div className="card p-8 bg-white border border-teal-200 shadow-xl max-w-xl mx-auto text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Prescription Delivered</span>
        <h2 className="text-2xl font-bold text-slate-900">Clinical Prescription Created</h2>
        <p className="text-xs text-slate-500">
          Generated Specification Filename: <strong className="font-mono text-primary font-bold">{createdRx.pdf_filename}</strong>
        </p>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-600">
          <div><strong>Patient:</strong> {appointment.patient_name}</div>
          <div><strong>Condition:</strong> {createdRx.disease_name}</div>
          <div><strong>Medications Count:</strong> {createdRx.medications?.length} items</div>
          <div><strong>Storage Outcome:</strong> Encrypted PDF stored in external vault</div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to={`/doctor/appointments/today`} className="btn-primary text-xs py-2 px-4">
            Return to Today's Queue
          </Link>
          <Link to={`/doctor/dashboard`} className="btn-secondary text-xs py-2 px-4">
            Doctor Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to={`/doctor/appointments/${appointment.id}`} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Appointment
      </Link>

      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Clinical Workspace</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Generate Digital Prescription</h1>
        <p className="text-xs text-slate-500">
          Patient: <strong className="text-slate-800">{appointment.patient_name}</strong> &bull; Slot: {appointment.start_time.slice(0, 5)}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitPrescription} className="space-y-6 text-xs">
        {/* Diagnosis Selection */}
        <div className="card p-6 bg-white border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary" />
            <span>1. Clinical Diagnosis (ICD Catalog)</span>
          </h2>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Confirmed Medical Condition</label>
            <select
              value={selectedDiseaseId}
              onChange={(e) => setSelectedDiseaseId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-primary bg-white"
            >
              {diseases.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} [{d.code}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Medication Table */}
        <div className="card p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-600" />
              <span>2. Medication Regimen (Rx)</span>
            </h2>
            <button
              type="button"
              onClick={handleAddMedication}
              className="text-primary hover:text-primary-dark font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Drug Row
            </button>
          </div>

          <div className="space-y-3">
            {medications.map((med, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    required
                    placeholder="Medicine Name (e.g. Tab Telmisartan)"
                    value={med.name}
                    onChange={(e) => handleUpdateMed(idx, 'name', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Dosage (40mg)"
                    value={med.dosage}
                    onChange={(e) => handleUpdateMed(idx, 'dosage', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Freq (1-0-1)"
                    value={med.frequency}
                    onChange={(e) => handleUpdateMed(idx, 'frequency', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Instructions (After food)"
                    value={med.instructions}
                    onChange={(e) => handleUpdateMed(idx, 'instructions', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-1 text-right">
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dosage Instructions & Follow-up */}
        <div className="card p-6 bg-white border border-slate-200 space-y-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Clinical Advice & Dietary Instructions</label>
            <textarea
              rows={2}
              value={dosageInstructions}
              onChange={(e) => setDosageInstructions(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Follow-up Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center text-slate-400 text-[11px]">
              Upon submission, a certified prescription PDF will be compiled and deposited into the patient's sovereign medical vault.
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Certified PDF...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Authorize & Issue Prescription</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
