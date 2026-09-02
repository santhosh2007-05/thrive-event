package com.caretrack.service;

import com.caretrack.model.Patient;

import java.util.List;
import java.util.Optional;

public interface PatientService {
    List<Patient> getAllPatients();
    Optional<Patient> getPatientById(String id);
    Optional<Patient> getPatientByPhone(String phone);
    Patient registerPatient(Patient patient);
    boolean validatePatientPassword(String usernameOrIdOrPhone, String password);
}
