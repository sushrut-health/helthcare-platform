/**
 * Concurrency-safe identifier counters and generator functions
 * Formats:
 * - Patient: PAI100001
 * - Doctor: DOC100001
 * - Laboratory: LAB100001
 * - Test: TST000001
 * - Disease: DIS000001
 * - Report: RPT000001
 * - Appointment: APT1001
 * - Lab Booking: LBD5001
 */

const counters = {
  patient: 100010,
  doctor: 100010,
  laboratory: 100010,
  test: 8,
  disease: 7,
  report: 3,
  appointment: 1010,
  booking: 5010,
  grant: 1010,
  request: 1010
};

export function generatePatientId() {
  counters.patient += 1;
  return `PAI${counters.patient}`;
}

export function generateDoctorId() {
  counters.doctor += 1;
  return `DOC${counters.doctor}`;
}

export function generateLaboratoryId() {
  counters.laboratory += 1;
  return `LAB${counters.laboratory}`;
}

export function generateTestId() {
  counters.test += 1;
  return `TST${String(counters.test).padStart(6, '0')}`;
}

export function generateDiseaseId() {
  counters.disease += 1;
  return `DIS${String(counters.disease).padStart(6, '0')}`;
}

export function generateReportId() {
  counters.report += 1;
  return `RPT${String(counters.report).padStart(6, '0')}`;
}

export function generateAppointmentId() {
  counters.appointment += 1;
  return `APT${counters.appointment}`;
}

export function generateBookingId() {
  counters.booking += 1;
  return `LBD${counters.booking}`;
}

export function generateGrantId() {
  counters.grant += 1;
  return `GRN${counters.grant}`;
}

export function generateRequestId() {
  counters.request += 1;
  return `REQ${counters.request}`;
}
