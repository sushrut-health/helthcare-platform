/**
 * Filename generator and validation according to Section 11 specifications:
 *
 * 1. Laboratory Reports:
 *    Pattern: PATIENT_ID-TEST_ID-LAB_ID-REPORT_ID.pdf
 *    Example: PAI100001-TST000001-LAB100001-RPT000001.pdf
 *
 * 2. Prescriptions:
 *    Pattern: PATIENT_ID-DISEASE_ID-DOCTOR_ID-RECORD_ID.pdf
 *    Example: PAI100001-DIS000001-DOC100001-RPT000001.pdf
 */

export function generateLabReportFilename({ patientId, testId, labId, reportId }) {
  if (!patientId || !testId || !labId || !reportId) {
    throw new Error('All segments (patientId, testId, labId, reportId) are required to generate lab report filename.');
  }
  return `${patientId}-${testId}-${labId}-${reportId}.pdf`;
}

export function generatePrescriptionFilename({ patientId, diseaseId, doctorId, recordId }) {
  if (!patientId || !diseaseId || !doctorId || !recordId) {
    throw new Error('All segments (patientId, diseaseId, doctorId, recordId) are required to generate prescription filename.');
  }
  return `${patientId}-${diseaseId}-${doctorId}-${recordId}.pdf`;
}

export function validateLabReportFilename(filename) {
  const regex = /^PAI\d+-TST\d+-LAB\d+-RPT\d+\.pdf$/;
  return regex.test(filename);
}

export function validatePrescriptionFilename(filename) {
  const regex = /^PAI\d+-DIS\d+-DOC\d+-RPT\d+\.pdf$/;
  return regex.test(filename);
}
