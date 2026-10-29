import { v4 as uuidv4 } from 'uuid';
import { db } from '../repositories/db.repository.js';
import { generateAppointmentId } from '../utils/identifiers.js';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/errors.js';

export class AppointmentService {
  /**
   * Generates available 15-minute slots for a doctor on a specific date
   */
  static getDoctorSlotsForDate(doctorId, dateString) {
    const store = db.store;
    const doctor = store.doctors.find(d => d.id === doctorId);
    if (!doctor) throw new NotFoundError('Doctor not found');

    if (doctor.verification_status !== 'approved') {
      return { availableSlots: [], message: 'Doctor is not currently approved for bookings.' };
    }

    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Check doctor availability rules for this day of week
    const rules = store.doctorAvailability.filter(
      a => a.doctor_id === doctorId && a.day_of_week === dayOfWeek && a.is_active
    );

    if (rules.length === 0) {
      return { doctor, date: dateString, slots: [] };
    }

    // Existing active bookings for this doctor on this date
    const existingBookings = store.appointments.filter(
      a => a.doctor_id === doctorId && a.appointment_date === dateString && a.status !== 'cancelled'
    );
    const bookedStartTimes = new Set(existingBookings.map(b => b.start_time.slice(0, 5)));

    const slots = [];

    rules.forEach(rule => {
      const slotDuration = rule.slot_duration_minutes || 15;
      const [startHour, startMin] = rule.start_time.split(':').map(Number);
      const [endHour, endMin] = rule.end_time.split(':').map(Number);

      let currentMinute = startHour * 60 + startMin;
      const endMinute = endHour * 60 + endMin;

      while (currentMinute + slotDuration <= endMinute) {
        const h = Math.floor(currentMinute / 60);
        const m = currentMinute % 60;
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        
        const nextMin = currentMinute + slotDuration;
        const nh = Math.floor(nextMin / 60);
        const nm = nextMin % 60;
        const endTimeStr = `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;

        const isBooked = bookedStartTimes.has(timeStr);

        let period = 'morning';
        if (h >= 12 && h < 16) period = 'afternoon';
        else if (h >= 16) period = 'evening';

        slots.push({
          time: timeStr,
          endTime: endTimeStr,
          period,
          available: !isBooked,
          status: isBooked ? 'booked' : 'available'
        });

        currentMinute += slotDuration;
      }
    });

    return {
      doctor: {
        id: doctor.id,
        doctorId: doctor.doctor_id,
        name: doctor.full_name,
        specialty: doctor.specialty_name,
        fee: doctor.consultation_fee,
        clinic: doctor.clinic_name,
        address: doctor.clinic_address
      },
      date: dateString,
      slots
    };
  }

  /**
   * Concurrency-safe atomic appointment booking
   */
  static async bookAppointment({ patientId, doctorId, date, startTime, consultationType = 'in_person', symptoms }) {
    const store = db.store;
    const patient = store.patients.find(p => p.id === patientId);
    if (!patient) throw new NotFoundError('Patient profile not found.');

    const doctor = store.doctors.find(d => d.id === doctorId);
    if (!doctor) throw new NotFoundError('Doctor not found.');

    if (doctor.verification_status !== 'approved') {
      throw new BadRequestError('Doctor is not approved to accept appointments.');
    }

    // Atomic double-booking verification
    const existingConflict = store.appointments.find(
      a => a.doctor_id === doctorId && 
           a.appointment_date === date && 
           a.start_time.startsWith(startTime) && 
           a.status !== 'cancelled'
    );

    if (existingConflict) {
      throw new ConflictError('This appointment slot has just been booked by another patient. Please select another slot.');
    }

    // Calculate end time (15 mins)
    const [h, m] = startTime.split(':').map(Number);
    const endMinutes = h * 60 + m + 15;
    const eh = Math.floor(endMinutes / 60);
    const em = endMinutes % 60;
    const endTime = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}:00`;

    const appointmentId = generateAppointmentId();
    const newAppointment = {
      id: uuidv4(),
      appointment_id: appointmentId,
      patient_id: patient.id,
      patient_name: patient.full_name,
      doctor_id: doctor.id,
      doctor_name: doctor.full_name,
      specialty_name: doctor.specialty_name,
      clinic_name: doctor.clinic_name,
      clinic_address: doctor.clinic_address,
      appointment_date: date,
      start_time: startTime.length === 5 ? `${startTime}:00` : startTime,
      end_time: endTime,
      status: 'confirmed',
      consultation_type: consultationType,
      fee: doctor.consultation_fee,
      symptoms: symptoms || 'General Consultation',
      created_at: new Date().toISOString()
    };

    store.appointments.push(newAppointment);

    // Create confirmation notifications
    store.notifications.push({
      id: uuidv4(),
      user_id: patient.user_id,
      title: 'Appointment Confirmed',
      message: `Your appointment with ${doctor.full_name} is confirmed for ${date} at ${startTime}.`,
      type: 'appointment',
      link_url: `/patient/appointments/${newAppointment.id}`,
      is_read: false,
      created_at: new Date().toISOString()
    });

    store.notifications.push({
      id: uuidv4(),
      user_id: doctor.user_id,
      title: 'New Appointment Booked',
      message: `${patient.full_name} has booked an appointment for ${date} at ${startTime}.`,
      type: 'appointment',
      link_url: `/doctor/appointments/${newAppointment.id}`,
      is_read: false,
      created_at: new Date().toISOString()
    });

    return newAppointment;
  }

  static async cancelAppointment(appointmentId, userId, userRole, reason) {
    const store = db.store;
    const apt = store.appointments.find(a => a.id === appointmentId || a.appointment_id === appointmentId);
    if (!apt) throw new NotFoundError('Appointment not found.');

    if (apt.status === 'cancelled') {
      throw new BadRequestError('Appointment is already cancelled.');
    }

    apt.status = 'cancelled';
    apt.cancellation_reason = reason || 'Cancelled by user';
    apt.cancelled_at = new Date().toISOString();
    apt.cancelled_by = userId;

    return { message: 'Appointment cancelled successfully.', appointment: apt };
  }

  static getPatientAppointments(patientId) {
    const store = db.store;
    return store.appointments
      .filter(a => a.patient_id === patientId)
      .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
  }

  static getDoctorAppointments(doctorId, dateFilter = null) {
    const store = db.store;
    let list = store.appointments.filter(a => a.doctor_id === doctorId);
    if (dateFilter) {
      list = list.filter(a => a.appointment_date === dateFilter);
    }
    return list.sort((a, b) => {
      if (a.appointment_date === b.appointment_date) {
        return a.start_time.localeCompare(b.start_time);
      }
      return new Date(b.appointment_date) - new Date(a.appointment_date);
    });
  }

  static getAppointmentById(id) {
    const store = db.store;
    const apt = store.appointments.find(a => a.id === id || a.appointment_id === id);
    if (!apt) throw new NotFoundError('Appointment not found.');
    return apt;
  }
}
